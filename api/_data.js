// Shared data store for Vercel serverless functions
// Note: In production, use a real database like MongoDB, Supabase, or Vercel KV
// This in-memory store will reset on each cold start

const voters = [
    { voterId: "VOTER001", name: "Rahul Kumar", hasVoted: false },
    { voterId: "VOTER002", name: "Priya Sharma", hasVoted: false },
    { voterId: "VOTER003", name: "Amit Singh", hasVoted: false },
    { voterId: "VOTER004", name: "Sneha Patel", hasVoted: false },
    { voterId: "VOTER005", name: "Vijay Reddy", hasVoted: false },
    { voterId: "VOTER006", name: "Anita Desai", hasVoted: false },
    { voterId: "VOTER007", name: "Rajesh Gupta", hasVoted: false },
    { voterId: "VOTER008", name: "Meera Iyer", hasVoted: false },
    { voterId: "VOTER009", name: "Suresh Nair", hasVoted: false },
    { voterId: "VOTER010", name: "Kavita Joshi", hasVoted: false },
    { voterId: "VOTER011", name: "Arjun Malhotra", hasVoted: false },
    { voterId: "VOTER012", name: "Deepa Krishnan", hasVoted: false },
    { voterId: "VOTER013", name: "Sanjay Mehta", hasVoted: false },
    { voterId: "VOTER014", name: "Pooja Agarwal", hasVoted: false },
    { voterId: "VOTER015", name: "Vikram Choudhary", hasVoted: false },
    { voterId: "VOTER016", name: "Nisha Kapoor", hasVoted: false },
    { voterId: "VOTER017", name: "Karan Saxena", hasVoted: false },
    { voterId: "VOTER018", name: "Swati Bhatt", hasVoted: false },
    { voterId: "VOTER019", name: "Prakash Yadav", hasVoted: false },
    { voterId: "VOTER020", name: "Ritu Bansal", hasVoted: false },
    { voterId: "VOTER021", name: "Nikhil Sharma", hasVoted: false },
    { voterId: "VOTER022", name: "Anjali Mishra", hasVoted: false },
    { voterId: "VOTER023", name: "Rohit Verma", hasVoted: false },
    { voterId: "VOTER024", name: "Shreya Pandey", hasVoted: false },
    { voterId: "VOTER025", name: "Aditya Jain", hasVoted: false },
    { voterId: "VOTER026", name: "Divya Srivastava", hasVoted: false },
    { voterId: "VOTER027", name: "Manish Dubey", hasVoted: false },
    { voterId: "VOTER028", name: "Priyanka Thakur", hasVoted: false },
    { voterId: "VOTER029", name: "Ashish Tripathi", hasVoted: false },
    { voterId: "VOTER030", name: "Neha Goyal", hasVoted: false }
];

const candidates = [
    { id: 1, name: "Arun Verma", party: "Progressive Party", symbol: "🍎", votes: 0 },
    { id: 2, name: "Sunita Rao", party: "Reform Alliance", symbol: "🔦", votes: 0 },
    { id: 3, name: "Manish Tiwari", party: "Unity Front", symbol: "🚲", votes: 0 },
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
