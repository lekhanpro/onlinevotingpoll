// Shared data store for Vercel serverless functions
// Note: In production, use a real database like MongoDB, Supabase, or Vercel KV
// This in-memory store will reset on each cold start

const voters = [
    { voterId: "VOTER001", name: "Rahul Kumar", hasVoted: true },
    { voterId: "VOTER002", name: "Priya Sharma", hasVoted: true },
    { voterId: "VOTER003", name: "Amit Singh", hasVoted: false },
    { voterId: "VOTER004", name: "Sneha Patel", hasVoted: false },
    { voterId: "VOTER005", name: "Vijay Reddy", hasVoted: false },
    { voterId: "VOTER006", name: "Anita Desai", hasVoted: false },
    { voterId: "VOTER007", name: "Rajesh Gupta", hasVoted: false },
    { voterId: "VOTER008", name: "Meera Iyer", hasVoted: false },
    { voterId: "VOTER009", name: "Suresh Nair", hasVoted: true },
    { voterId: "VOTER010", name: "Kavita Joshi", hasVoted: false }
];

const candidates = [
    { id: 1, name: "Arun Verma", party: "Progressive Party", symbol: "🍎", votes: 1 },
    { id: 2, name: "Sunita Rao", party: "Reform Alliance", symbol: "🔦", votes: 1 },
    { id: 3, name: "Manish Tiwari", party: "Unity Front", symbol: "🚲", votes: 1 },
    { id: 4, name: "Lakshmi Menon", party: "People's Voice", symbol: "✋", votes: 0 }
];

// Use global to persist across serverless invocations within same instance
if (!global.votingData) {
    global.votingData = { voters, candidates };
}

module.exports = {
    getVoters: () => global.votingData.voters,
    getCandidates: () => global.votingData.candidates,
    findVoter: (voterId) => global.votingData.voters.find(
        v => v.voterId.toUpperCase() === voterId.toUpperCase().trim()
    ),
    findVoterIndex: (voterId) => global.votingData.voters.findIndex(
        v => v.voterId.toUpperCase() === voterId.toUpperCase().trim()
    ),
    findCandidateIndex: (candidateId) => global.votingData.candidates.findIndex(
        c => c.id === parseInt(candidateId)
    ),
    markVoted: (voterIndex) => {
        global.votingData.voters[voterIndex].hasVoted = true;
    },
    addVote: (candidateIndex) => {
        global.votingData.candidates[candidateIndex].votes += 1;
    }
};
