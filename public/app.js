/**
 * Online Voting System - Client-Side JavaScript
 * Handles login, voting, and session management
 */

// API Base URL - empty for same-origin requests
const API_BASE = '';

// ==================== SESSION MANAGEMENT ====================

/**
 * Check if voter is logged in and redirect if not
 */
function checkVoterSession() {
    const voterId = sessionStorage.getItem('voterId');
    const voterName = sessionStorage.getItem('voterName');

    if (!voterId || !voterName) {
        // Not logged in, redirect to login page
        window.location.href = '/';
        return false;
    }

    // Update UI with voter info
    const voterNameElement = document.getElementById('voterName');
    if (voterNameElement) {
        voterNameElement.textContent = voterName;
    }

    return true;
}

/**
 * Logout the current voter
 */
function logout() {
    sessionStorage.clear();
    window.location.href = '/';
}

// ==================== LOGIN ====================

/**
 * Handle login form submission
 */
async function handleLogin(event) {
    event.preventDefault();

    const voterIdInput = document.getElementById('voterId');
    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = errorMessage.querySelector('.error-text');

    const voterId = voterIdInput.value.trim().toUpperCase();

    if (!voterId) {
        showError('Please enter your Voter ID');
        return;
    }

    // Show loading state
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span class="spinner-small"></span> Verifying...';
    hideError();

    try {
        const response = await fetch(`${API_BASE}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ voterId })
        });

        const data = await response.json();

        if (data.success) {
            // Store voter info in session
            sessionStorage.setItem('voterId', data.voter.voterId);
            sessionStorage.setItem('voterName', data.voter.name);

            // Redirect to ballot page
            window.location.href = '/ballot';
        } else {
            showError(data.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Unable to connect to server. Please try again.');
    } finally {
        // Reset button state
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<span class="btn-text">Proceed to Vote</span><span class="btn-icon">→</span>';
    }
}

/**
 * Show error message
 */
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    const errorText = errorMessage.querySelector('.error-text');
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');

    // Shake animation
    errorMessage.style.animation = 'none';
    setTimeout(() => {
        errorMessage.style.animation = 'shake 0.5s ease';
    }, 10);
}

/**
 * Hide error message
 */
function hideError() {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.classList.add('hidden');
    }
}

// ==================== BALLOT / VOTING ====================

// Store selected candidate info
let selectedCandidate = null;

/**
 * Load candidates from server
 */
async function loadCandidates() {
    const candidatesList = document.getElementById('candidatesList');

    try {
        const response = await fetch(`${API_BASE}/api/candidates`);
        const data = await response.json();

        if (data.success) {
            displayCandidates(data.candidates);
        } else {
            candidatesList.innerHTML = `
                <div class="error-message">
                    <span class="error-icon">⚠️</span>
                    <span>Unable to load candidates. Please refresh the page.</span>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading candidates:', error);
        candidatesList.innerHTML = `
            <div class="error-message">
                <span class="error-icon">⚠️</span>
                <span>Unable to connect to server. Please try again.</span>
            </div>
        `;
    }
}

/**
 * Display candidates in the ballot
 */
function displayCandidates(candidates) {
    const candidatesList = document.getElementById('candidatesList');

    candidatesList.innerHTML = candidates.map((candidate, index) => `
        <div class="candidate-row" data-id="${candidate.id}">
            <div class="candidate-info">
                <div class="candidate-serial">${index + 1}</div>
                <div class="candidate-symbol">${candidate.symbol}</div>
                <div class="candidate-details">
                    <h4>${candidate.name}</h4>
                    <p>${candidate.party}</p>
                </div>
            </div>
            <div class="vote-button-container">
                <button class="btn btn-vote" onclick="selectCandidate(${candidate.id}, '${candidate.name}', '${candidate.party}', '${candidate.symbol}')">
                    VOTE
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Select a candidate and show confirmation modal
 */
function selectCandidate(id, name, party, symbol) {
    selectedCandidate = { id, name, party, symbol };

    // Update modal content
    document.getElementById('modalSymbol').textContent = symbol;
    document.getElementById('modalCandidateName').textContent = name;
    document.getElementById('modalPartyName').textContent = party;

    // Show modal
    document.getElementById('confirmModal').classList.remove('hidden');
}

/**
 * Close the confirmation modal
 */
function closeModal() {
    document.getElementById('confirmModal').classList.add('hidden');
    selectedCandidate = null;
}

/**
 * Confirm and submit the vote
 */
async function confirmVote() {
    if (!selectedCandidate) {
        closeModal();
        return;
    }

    const voterId = sessionStorage.getItem('voterId');
    if (!voterId) {
        alert('Session expired. Please login again.');
        window.location.href = '/';
        return;
    }

    // Disable confirm button
    const confirmBtn = document.querySelector('.modal-footer .btn-success');
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<span class="spinner-small"></span> Recording Vote...';

    try {
        const response = await fetch(`${API_BASE}/api/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                voterId: voterId,
                candidateId: selectedCandidate.id
            })
        });

        const data = await response.json();

        if (data.success) {
            // Store vote info for receipt
            sessionStorage.setItem('votedCandidate', selectedCandidate.name);

            // Redirect to thank you page
            window.location.href = '/thankyou';
        } else {
            closeModal();
            alert(data.message);

            // If already voted, redirect to home
            if (response.status === 403) {
                sessionStorage.clear();
                window.location.href = '/';
            }
        }
    } catch (error) {
        console.error('Voting error:', error);
        closeModal();
        alert('Unable to record vote. Please try again.');
    }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Add shake animation keyframes
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .spinner-small {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ==================== EVENT LISTENERS ====================

// Close modal when clicking outside
document.addEventListener('click', (event) => {
    const modal = document.getElementById('confirmModal');
    if (modal && event.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Prevent going back after voting
if (window.location.pathname === '/thankyou') {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };
}
