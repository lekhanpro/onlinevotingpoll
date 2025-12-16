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

    const { voterId, candidateId } = req.body;

    if (!voterId || !candidateId) {
        return res.status(400).json({
            success: false,
            message: 'Invalid request: Voter ID and Candidate ID are required'
        });
    }

    // Find the voter
    const voterIndex = data.findVoterIndex(voterId);

    if (voterIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Invalid Voter ID'
        });
    }

    const voters = data.getVoters();
    if (voters[voterIndex].hasVoted) {
        return res.status(403).json({
            success: false,
            message: 'You have already voted. Each voter can only vote once.'
        });
    }

    // Find the candidate
    const candidateIndex = data.findCandidateIndex(candidateId);

    if (candidateIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Invalid Candidate ID'
        });
    }

    // Record the vote
    data.markVoted(voterIndex);
    data.addVote(candidateIndex);

    const candidates = data.getCandidates();

    res.json({
        success: true,
        message: 'Your vote has been recorded successfully!',
        candidateName: candidates[candidateIndex].name
    });
};
