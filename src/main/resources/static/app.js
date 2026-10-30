const API = '/api';

let plans = [];
let selectedPlan = null;
let currentCustomer = null;

const $ = id => document.getElementById(id);

const money = v => '₹' + Number(v).toFixed(0);


// ===============================
// API HELPER
// ===============================

async function api(url, options = {}) {

    const r = await fetch(API + url, {
        headers: {
            'Content-Type': 'application/json'
        },
        ...options
    });

    const data = await r.json().catch(() => ({
        message: 'Unexpected server response'
    }));

    if (!r.ok) {
        throw new Error(data.message || 'Request failed');
    }

    return data;
}


// ===============================
// LOAD PLANS
// ===============================

async function loadPlans() {

    $('plansGrid').innerHTML =
        '<div class="loading">Loading plans…</div>';

    try {

        plans = await api('/plans');

        $('planCount').textContent = plans.length;

        $('plansGrid').innerHTML = plans.map((p, i) => `
            <article class="plan-card">

                ${i === 1 ? '<span class="plan-tag">POPULAR</span>' : ''}

                <h3>${p.planName}</h3>

                <div class="price">
                    ${money(p.price)}
                    <small>/ pack</small>
                </div>

                <div class="plan-meta">
                    <span class="pill">📶 ${p.validityDays} days</span>
                    <span class="pill">🔥 ${p.popularityCount || 0} recharges</span>
                </div>

                <div class="benefit">
                    ${p.benefits || 'Flexible prepaid benefits'}
                </div>

                <button
                    class="select-btn"
                    onclick="selectPlan(${p.planId})">
                    Select plan →
                </button>

            </article>
        `).join('');

    } catch (e) {

        $('plansGrid').innerHTML =
            '<div class="loading">Unable to load plans. Start the Spring Boot server and refresh.</div>';

        showToast(e.message);
    }
}


// ===============================
// SELECT PLAN
// ===============================

function selectPlan(id) {

    selectedPlan = plans.find(p => p.planId === id);

    if (!selectedPlan) return;

    $('cartCount').textContent = '1';

    const verifiedNumber =
        currentCustomer?.customerNumber ||
        $('mobileNumber').value.trim();

    const verifiedName =
        currentCustomer?.customerName || '';

    const numberBlock = currentCustomer

        ? `
            <div class="customer-confirmed">
                <strong>✓ ${verifiedName}</strong>
                <span>+91 ${verifiedNumber}</span>
                <small>Verified customer</small>
            </div>
          `

        : `
            <input
                id="cartNumber"
                class="full-input"
                maxlength="10"
                value="${verifiedNumber}"
                placeholder="Enter 10-digit number">
          `;

    $('cartBody').innerHTML = `

        <div class="cart-plan">

            <span class="eyebrow">SELECTED PLAN</span>

            <h3>${selectedPlan.planName}</h3>

            <p>${selectedPlan.benefits}</p>

            <div class="summary-row">
                <span>Price</span>
                <strong>${money(selectedPlan.price)}</strong>
            </div>

            <div class="summary-row">
                <span>Validity</span>
                <strong>${selectedPlan.validityDays} days</strong>
            </div>

        </div>

        <div class="cart-plan">

            <span class="eyebrow">RECHARGE FOR</span>

            ${numberBlock}

        </div>

        <button
            class="primary-btn checkout"
            onclick="openPayment()">

            Continue to payment · ${money(selectedPlan.price)}

        </button>
    `;

    $('cartDrawer').classList.add('open');

    $('overlay').classList.add('show');
}


// ===============================
// CART NUMBER
// ===============================

function getCartNumber() {

    return currentCustomer?.customerNumber ||
        $('cartNumber')?.value.trim() ||
        '';
}


// ===============================
// OPEN PAYMENT
// ===============================

function openPayment() {

    const number = getCartNumber();

    if (!/^\d{10}$/.test(number)) {

        showToast(
            'Enter or verify a valid 10-digit mobile number'
        );

        return;
    }

    if (!selectedPlan) {

        showToast('Select a plan first');

        return;
    }

    const name =
        currentCustomer?.customerName || 'Customer';

    $('paymentSummary').innerHTML = `

        <div class="payment-plan-row">

            <div>

                <span class="eyebrow">
                    RECHARGE FOR
                </span>

                <strong>${name}</strong>

                <small>${number}</small>

            </div>

            <strong class="payment-amount">
                ${money(selectedPlan.price)}
            </strong>

        </div>

        <div class="payment-plan-row">

            <div>

                <strong>
                    ${selectedPlan.planName}
                </strong>

                <small>
                    ${selectedPlan.benefits}
                    ·
                    ${selectedPlan.validityDays} days
                </small>

            </div>

            <span class="pill">
                New plan
            </span>

        </div>
    `;

    $('payBtn').textContent =
        `Pay ${money(selectedPlan.price)}`;

    $('payBtn').disabled = false;

    $('paymentModal').classList.remove('hidden');
}


// ===============================
// CLOSE PAYMENT
// ===============================

function closePayment() {

    $('paymentModal').classList.add('hidden');

    const btn = $('payBtn');

    btn.disabled = false;

    btn.textContent =
        selectedPlan
            ? `Pay ${money(selectedPlan.price)}`
            : 'Pay now';
}


// ===============================
// PROCESS PAYMENT
// ===============================

async function processPayment() {

    const number = getCartNumber();

    if (!/^\d{10}$/.test(number)) {

        showToast(
            'Enter or verify a valid 10-digit mobile number'
        );

        return;
    }

    if (!selectedPlan) return;

    const method =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        )?.value || 'UPI';

    if (
        method === 'UPI' &&
        !$('paymentRef').value.trim().includes('@')
    ) {

        showToast('Enter a valid demo UPI ID');

        return;
    }

    const btn = $('payBtn');

    btn.disabled = true;

    btn.textContent = 'Processing payment…';

    showToast(`Processing ${method} payment…`);

    await new Promise(
        resolve => setTimeout(resolve, 1200)
    );

    try {

        const result = await api('/recharges', {

            method: 'POST',

            body: JSON.stringify({

                customerNumber: number,

                planId: selectedPlan.planId

            })
        });

        currentCustomer =
            await api('/customers/' + number);

        closePayment();

        closeCart();

        $('cartCount').textContent = '0';

        showSuccess(result, method);

        renderCustomer(currentCustomer);

        $('customerBadge').textContent =
            '✓ ' +
            currentCustomer.customerName +
            ' · ' +
            currentCustomer.customerNumber;

        $('customerBadge').classList.remove('hidden');

        $('heroStatus').textContent =
            currentCustomer.planName;

        loadHistory();

        loadPlans();

        loadAdminDashboard();

    } catch (e) {

        btn.disabled = false;

        btn.textContent =
            `Pay ${money(selectedPlan.price)}`;

        showToast(e.message);
    }
}


// ===============================
// OLD RECHARGE COMPATIBILITY
// ===============================

async function confirmRecharge() {

    openPayment();
}


// ===============================
// CHECK CUSTOMER STATUS
// ===============================

async function checkStatus() {

    const number =
        $('mobileNumber').value.trim();

    if (!/^\d{10}$/.test(number)) {

        showToast(
            'Enter a valid 10-digit mobile number first'
        );

        return;
    }

    try {

        currentCustomer =
            await api('/customers/' + number);

        renderCustomer(currentCustomer);

        loadHistory();

        $('customerBadge').textContent =
            '✓ ' +
            currentCustomer.customerName +
            ' · ' +
            currentCustomer.customerNumber;

        $('customerBadge').classList.remove('hidden');

        $('heroStatus').textContent =
            currentCustomer.planName;

        document.querySelector('#status')
            .scrollIntoView({
                behavior: 'smooth'
            });

    } catch (e) {

        /*
         * Customer doesn't exist.
         * Open registration popup.
         */

        if (
            e.message.toLowerCase().includes('not found')
        ) {

            $('registerNumber').value = number;

            $('registerName').value = '';

            $('registerModal')
                .classList.remove('hidden');

            $('heroStatus').textContent =
                'New customer';

        } else {

            showToast(e.message);

            $('heroStatus').textContent =
                'Not found';
        }
    }
}


// ===============================
// NEW CUSTOMER REGISTRATION
// ===============================

function closeRegister() {

    $('registerModal')
        .classList.add('hidden');
}


async function registerCustomer() {

    const name =
        $('registerName').value.trim();

    const number =
        $('registerNumber').value.trim();


    if (!name) {

        showToast(
            'Please enter customer name'
        );

        return;
    }


    if (!/^\d{10}$/.test(number)) {

        showToast(
            'Invalid mobile number'
        );

        return;
    }


    try {

        showToast(
            'Registering customer...'
        );


        const customer =
            await api('/customers/register', {

                method: 'POST',

                body: JSON.stringify({

                    customerName: name,

                    customerNumber: number

                })
            });


        /*
         * Store newly registered customer
         */

        currentCustomer = customer;


        /*
         * Close registration popup
         */

        closeRegister();


        /*
         * Update customer badge
         */

        $('customerBadge').textContent =
            '✓ ' +
            customer.customerName +
            ' · ' +
            customer.customerNumber;

        $('customerBadge')
            .classList.remove('hidden');


        /*
         * Update hero status
         */

        $('heroStatus').textContent =
            'No active plan';


        /*
         * Show success message
         */

        showToast(
            'Customer registered successfully'
        );


        /*
         * Refresh admin dashboard
         */

        loadAdminDashboard();


        /*
         * Go to plans
         */

        document.querySelector('#plans')
            .scrollIntoView({
                behavior: 'smooth'
            });


    } catch (e) {

        console.error(
            'Registration error:',
            e
        );

        showToast(e.message);
    }
}


// ===============================
// VALIDITY CALCULATION
// ===============================

function getDaysRemaining(validUntil) {

    if (!validUntil) return null;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const end =
        new Date(validUntil + 'T00:00:00');

    return Math.ceil(
        (end - today) / 86400000
    );
}


// ===============================
// RENDER CUSTOMER
// ===============================

function renderCustomer(c) {

    $('statusCard')
        .classList.remove('empty');

    const remaining =
        getDaysRemaining(c.validUntil);

    const total =
        Number(c.validityDays) || 0;

    const percent =
        remaining === null || !total
            ? 0
            : Math.max(
                0,
                Math.min(
                    100,
                    (remaining / total) * 100
                )
            );

    const isExpired =
        remaining !== null &&
        remaining < 0;

    const isExpiring =
        !isExpired &&
        remaining !== null &&
        remaining <= 7;

    const statusText =
        isExpired
            ? '● Expired'
            : isExpiring
                ? '● Expiring soon'
                : '● Active';

    const statusClass =
        isExpired
            ? 'expired'
            : isExpiring
                ? 'expiring'
                : 'active';

    const remainingText =
        remaining === null
            ? '—'
            : isExpired
                ? Math.abs(remaining) +
                  ' days overdue'
                : remaining === 0
                    ? 'Expires today'
                    : remaining +
                      ' days remaining';


    $('statusCard').innerHTML = `

        <div class="status-main">

            <div>

                <span class="eyebrow">
                    ACTIVE PLAN
                </span>

                <h3>
                    ${c.planName}
                </h3>

            </div>

            <span class="valid ${statusClass}">
                ${statusText}
            </span>

        </div>

        <p>
            ${c.customerName}
            ·
            ${c.customerNumber}
        </p>

        <div class="remaining-box ${statusClass}">

            <div>

                <span>
                    VALIDITY STATUS
                </span>

                <strong>
                    ${remainingText}
                </strong>

            </div>

            <div class="progress-track">

                <div
                    class="progress-fill"
                    style="width:${percent}%">
                </div>

            </div>

        </div>

        <div class="status-details">

            <div class="detail">
                <span>Price</span>
                <strong>
                    ${c.amount ? money(c.amount) : '—'}
                </strong>
            </div>

            <div class="detail">
                <span>Plan validity</span>
                <strong>
                    ${c.validityDays
                        ? c.validityDays + ' days'
                        : '—'}
                </strong>
            </div>

            <div class="detail">
                <span>Valid until</span>
                <strong>
                    ${c.validUntil || '—'}
                </strong>
            </div>

            <div class="detail">
                <span>Days remaining</span>
                <strong>
                    ${
                        remaining === null
                            ? '—'
                            : Math.max(0, remaining)
                    }
                </strong>
            </div>

            <div class="detail">
                <span>Plan ID</span>
                <strong>
                    ${c.planId || '—'}
                </strong>
            </div>

        </div>
    `;
}


// ===============================
// RECHARGE HISTORY
// ===============================

async function loadHistory() {

    if (!currentCustomer) return;

    try {

        const rows =
            await api(
                '/customers/' +
                currentCustomer.customerNumber +
                '/history'
            );


        $('historyList').innerHTML =
            rows.length

                ? rows.map(x => `

                    <div class="history-item">

                        <div class="history-left">

                            <span class="history-icon">
                                ↗
                            </span>

                            <div>

                                <strong>
                                    ${x.planName}
                                </strong>

                                <small>
                                    Recharge completed
                                </small>

                            </div>

                        </div>

                        <div class="history-right">

                            <strong>
                                ${money(x.amount)}
                            </strong>

                            <span>
                                ${x.rechargeDate}
                            </span>

                        </div>

                    </div>

                `).join('')

                : `

                    <div class="history-empty">

                        <span>🧾</span>

                        <strong>
                            No recharge history yet
                        </strong>

                        <small>
                            Completed recharges will appear here.
                        </small>

                    </div>
                `;

    } catch (e) {

        $('historyList').innerHTML = `

            <div class="history-empty">

                <span>⚠</span>

                <strong>
                    Unable to load history
                </strong>

                <small>
                    Try refreshing after checking the customer number.
                </small>

            </div>
        `;
    }
}


// ===============================
// EXPIRING REPORT
// ===============================

async function loadExpiring() {

    $('expiringModal')
        .classList.remove('hidden');

    $('expiringList').innerHTML =
        '<div class="report-loading">Loading expiring customers…</div>';


    try {

        const rows =
            await api('/reports/expiring?days=7');


        if (!rows.length) {

            $('expiringList').innerHTML = `

                <div class="report-empty">

                    <div class="report-empty-icon">
                        ✓
                    </div>

                    <h3>
                        No customers expiring soon
                    </h3>

                    <p>
                        All active plans have more than
                        7 days of validity remaining.
                    </p>

                </div>
            `;

            return;
        }


        $('expiringList').innerHTML =
            rows.map(x => {

                const days =
                    getDaysRemaining(x.validUntil);

                const label =
                    days === 0
                        ? 'Expires today'
                        : `${days} day${days === 1 ? '' : 's'} remaining`;


                return `

                    <div class="expiring-item">

                        <div class="expiring-avatar">
                            ${(x.customerName || 'C')
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div class="expiring-main">

                            <div class="expiring-top">

                                <strong>
                                    ${x.customerName}
                                </strong>

                                <span class="warning-badge">
                                    ${label}
                                </span>

                            </div>

                            <div class="expiring-number">
                                +91 ${x.customerNumber}
                            </div>

                            <div class="expiring-meta">

                                <span>
                                    ${x.planName} plan
                                </span>

                                <span>
                                    Expires ${x.validUntil}
                                </span>

                            </div>

                        </div>

                    </div>
                `;

            }).join('');


    } catch (e) {

        $('expiringList').innerHTML = `

            <div class="report-empty">

                <div class="report-empty-icon error">
                    !
                </div>

                <h3>
                    Unable to load report
                </h3>

                <p>
                    ${e.message}
                </p>

            </div>
        `;
    }
}


function closeExpiring() {

    $('expiringModal')
        .classList.add('hidden');
}


// ===============================
// POPULAR PLANS
// ===============================

async function loadPopular() {

    $('popularModal')
        .classList.remove('hidden');

    $('popularList').innerHTML =
        '<div class="report-loading">Loading popularity…</div>';


    try {

        const rows =
            await api('/plans/popular');


        if (!rows.length) {

            $('popularList').innerHTML = `

                <div class="report-empty">

                    <div class="report-empty-icon">
                        🔥
                    </div>

                    <h3>
                        No recharge data yet
                    </h3>

                    <p>
                        Successful recharges will appear here
                        once customers start using the plans.
                    </p>

                </div>
            `;

            return;
        }


        $('popularList').innerHTML =
            rows.map((x, i) => {

                const count =
                    Number(x.popularityCount) || 0;

                const rank = i + 1;

                const label =
                    count === 1
                        ? 'recharge'
                        : 'recharges';


                return `

                    <div class="popular-item">

                        <div class="popular-rank">
                            ${rank}
                        </div>

                        <div class="popular-plan-icon">
                            ${rank === 1 ? '🔥' : '📱'}
                        </div>

                        <div class="popular-main">

                            <div class="popular-top">

                                <strong>
                                    ${x.planName}
                                </strong>

                                ${
                                    rank === 1
                                        ? '<span class="top-badge">MOST POPULAR</span>'
                                        : ''
                                }

                            </div>

                            <small>
                                ${x.benefits || 'Recharge plan'}
                                ·
                                ${x.validityDays || 0} days
                            </small>

                        </div>

                        <div class="popular-side">

                            <strong>
                                ${money(x.price)}
                            </strong>

                            <span>
                                ${count} ${label}
                            </span>

                        </div>

                    </div>
                `;

            }).join('');


    } catch (e) {

        $('popularList').innerHTML = `

            <div class="report-empty">

                <div class="report-empty-icon error">
                    !
                </div>

                <h3>
                    Unable to load popularity
                </h3>

                <p>
                    ${e.message}
                </p>

            </div>
        `;
    }
}


function closePopular() {

    $('popularModal')
        .classList.add('hidden');
}


// ===============================
// ADMIN DASHBOARD
// ===============================

async function loadAdminDashboard() {

    try {

        const data =
            await api('/admin/dashboard');


        $('adminCustomers').textContent =
            data.totalCustomers;

        $('adminRecharges').textContent =
            data.totalRecharges;

        $('adminRevenue').textContent =
            money(data.totalRevenue);

        $('adminPopularPlan').textContent =
            data.mostPopularPlan;

        $('adminExpiring').textContent =
            data.expiringCustomers;


    } catch (e) {

        console.error(
            'Admin dashboard error:',
            e
        );

        showToast(
            'Unable to load admin dashboard'
        );
    }
}


// ===============================
// GENERAL MODALS
// ===============================

function showInfo(title, text) {

    $('modalIcon').textContent = 'i';

    $('modalIcon').style.background =
        '#eee9ff';

    $('modalIcon').style.color =
        'var(--primary)';

    $('modalTitle').textContent =
        title;

    $('modalText').style.whiteSpace =
        'pre-line';

    $('modalText').textContent =
        text;

    $('modal').classList.remove('hidden');
}


function showSuccess(
    r,
    method = 'Demo payment'
) {

    $('modalIcon').textContent = '✓';

    $('modalIcon').style.background =
        '#e5f8ef';

    $('modalIcon').style.color =
        'var(--green)';

    $('modalTitle').textContent =
        'Recharge successful';

    $('modalText').style.whiteSpace =
        'normal';

    $('modalText').textContent =
        `${r.customerName}'s ${r.planName} plan is now active until ${r.validUntil}. Amount paid: ${money(r.amount)} via ${method}.`;

    $('modal').classList.remove('hidden');
}


function closeModal() {

    $('modal')
        .classList.add('hidden');
}


function closeCart() {

    $('cartDrawer')
        .classList.remove('open');

    $('overlay')
        .classList.remove('show');
}


function showToast(msg) {

    $('toast').textContent = msg;

    $('toast')
        .classList.add('show');

    setTimeout(() => {

        $('toast')
            .classList.remove('show');

    }, 2800);
}


// ===============================
// PAYMENT METHOD EVENTS
// ===============================

document
    .querySelectorAll('.payment-option input')
    .forEach(input => {

        input.addEventListener(
            'change',
            () => {

                document
                    .querySelectorAll('.payment-option')
                    .forEach(x =>
                        x.classList.remove('active')
                    );

                input
                    .closest('.payment-option')
                    .classList.add('active');
            }
        );
    });


// ===============================
// BUTTON EVENTS
// ===============================

$('checkBtn')
    .addEventListener(
        'click',
        checkStatus
    );


$('cartBtn')
    .addEventListener(
        'click',
        () => {

            if (selectedPlan) {

                selectPlan(
                    selectedPlan.planId
                );

            } else {

                showToast(
                    'Select a plan first'
                );
            }
        }
    );


// ===============================
// START APPLICATION
// ===============================

loadPlans();

loadAdminDashboard();