const data = require('./_data');

module.exports = (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { voterId } = req.body;

    if (!voterId || voterId.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid Voter ID'
        });
    }

    // Find the voter
    const voter = data.findVoter(voterId);

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
};
