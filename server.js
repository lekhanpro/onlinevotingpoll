const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Data file paths
const votersFile = path.join(__dirname, 'data', 'voters.json');
const candidatesFile = path.join(__dirname, 'data', 'candidates.json');

// Helper functions to read/write JSON files
const readJSON = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return null;
    }
};

const writeJSON = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
};

// ==================== API ROUTES ====================

/**
 * POST /api/login
 * Validate Voter ID and check if already voted
 * Body: { voterId: string }
 */
app.post('/api/login', (req, res) => {
    const { voterId } = req.body;

    if (!voterId || voterId.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid Voter ID'
        });
    }

    const votersData = readJSON(votersFile);
    if (!votersData) {
        return res.status(500).json({
            success: false,
            message: 'Server error: Unable to read voter database'
        });
    }

    // Find the voter
    const voter = votersData.voters.find(
        v => v.voterId.toUpperCase() === voterId.toUpperCase().trim()
    );

    if (!voter) {
        return res.status(404).json({
            success: false,
            message: 'Invalid Voter ID. Please check and try again.'
        });
    }

    if (voter.hasVoted) {
        return res.status(403).json({
            success: false,
            message: 'You have already voted. Each voter can only vote once.'
        });
    }

    // Login successful
    res.json({
        success: true,
        message: 'Login successful',
        voter: {
            voterId: voter.voterId,
            name: voter.name
        }
    });
});

/**
 * GET /api/candidates
 * Get list of all candidates
 */
app.get('/api/candidates', (req, res) => {
    const candidatesData = readJSON(candidatesFile);
    if (!candidatesData) {
        return res.status(500).json({
            success: false,
            message: 'Server error: Unable to read candidates database'
        });
    }

    // Return candidates without vote counts (for security)
    const candidates = candidatesData.candidates.map(c => ({
        id: c.id,
        name: c.name,
        party: c.party,
        symbol: c.symbol
    }));

    res.json({
        success: true,
        candidates
    });
});

/**
 * POST /api/vote
 * Cast a vote for a candidate
 * Body: { voterId: string, candidateId: number }
 */
app.post('/api/vote', (req, res) => {
    const { voterId, candidateId } = req.body;

    if (!voterId || !candidateId) {
        return res.status(400).json({
            success: false,
            message: 'Invalid request: Voter ID and Candidate ID are required'
        });
    }

    // Read current data
    const votersData = readJSON(votersFile);
    const candidatesData = readJSON(candidatesFile);

    if (!votersData || !candidatesData) {
        return res.status(500).json({
            success: false,
            message: 'Server error: Unable to read database'
        });
    }

    // Find the voter
    const voterIndex = votersData.voters.findIndex(
        v => v.voterId.toUpperCase() === voterId.toUpperCase().trim()
    );

    if (voterIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Invalid Voter ID'
        });
    }

    if (votersData.voters[voterIndex].hasVoted) {
        return res.status(403).json({
            success: false,
            message: 'You have already voted. Each voter can only vote once.'
        });
    }

    // Find the candidate
    const candidateIndex = candidatesData.candidates.findIndex(
        c => c.id === parseInt(candidateId)
    );

    if (candidateIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Invalid Candidate ID'
        });
    }

    // Record the vote
    votersData.voters[voterIndex].hasVoted = true;
    candidatesData.candidates[candidateIndex].votes += 1;

    // Save updated data
    const votersSaved = writeJSON(votersFile, votersData);
    const candidatesSaved = writeJSON(candidatesFile, candidatesData);

    if (!votersSaved || !candidatesSaved) {
        return res.status(500).json({
            success: false,
            message: 'Server error: Unable to save vote'
        });
    }

    res.json({
        success: true,
        message: 'Your vote has been recorded successfully!',
        candidateName: candidatesData.candidates[candidateIndex].name
    });
});

/**
 * GET /api/check-voted/:voterId
 * Check if a voter has already voted
 */
app.get('/api/check-voted/:voterId', (req, res) => {
    const { voterId } = req.params;

    const votersData = readJSON(votersFile);
    if (!votersData) {
        return res.status(500).json({
            success: false,
            message: 'Server error: Unable to read voter database'
        });
    }

    const voter = votersData.voters.find(
        v => v.voterId.toUpperCase() === voterId.toUpperCase().trim()
    );

    if (!voter) {
        return res.status(404).json({
            success: false,
            message: 'Voter not found'
        });
    }

    res.json({
        success: true,
        hasVoted: voter.hasVoted
    });
});

/**
 * GET /api/results
 * Get current vote counts (Admin only - for demo purposes)
 */
app.get('/api/results', (req, res) => {
    const candidatesData = readJSON(candidatesFile);
    if (!candidatesData) {
        return res.status(500).json({
            success: false,
            message: 'Server error: Unable to read candidates database'
        });
    }

    const totalVotes = candidatesData.candidates.reduce((sum, c) => sum + c.votes, 0);

    res.json({
        success: true,
        totalVotes,
        results: candidatesData.candidates.map(c => ({
            id: c.id,
            name: c.name,
            party: c.party,
            symbol: c.symbol,
            votes: c.votes,
            percentage: totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(2) : 0
        }))
    });
});

// ==================== SERVE HTML PAGES ====================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/ballot', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ballot.html'));
});

app.get('/thankyou', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'thankyou.html'));
});

app.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'results.html'));
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║         🗳️  ONLINE VOTING SYSTEM - SERVER RUNNING  🗳️    ║
    ║                                                           ║
    ╠═══════════════════════════════════════════════════════════╣
    ║                                                           ║
    ║   Server is running on: http://localhost:${PORT}          ║
    ║                                                           ║
    ║   Available Pages:                                        ║
    ║   • Login:    http://localhost:${PORT}/                   ║
    ║   • Ballot:   http://localhost:${PORT}/ballot             ║
    ║   • Results:  http://localhost:${PORT}/results            ║
    ║                                                           ║
    ║   Sample Voter IDs: VOTER001 to VOTER010                  ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
    `);
});
