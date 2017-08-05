const stripe = Stripe('pk_test_7YGV8yBW94XPIMiSOpnNErkM');
const elements = stripe.elements();

const style = {
    base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
            color: '#aab7c4'
        }
    },
    invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
    }
};

// Create an instance of the card Element
const card = elements.create('card', {style});

// Add an instance of the card Element into the `card-element` <div>
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', ({error}) => {
    const displayError = document.getElementById('card-errors');
    if (error) {
        displayError.textContent = error.message;
    } else {
        displayError.textContent = '';
    }
});

// Create a token or display an error when the form is submitted.
const form = document.getElementById('payForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const {token, error} = await stripe.createToken(card);
    if (error) {
        // Inform the user if there was an error
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = error.message;
    } else {
       //todo enable the book cleaning button
        $.ajax({
            url: "/token",
            type: "POST",
            data: {token: token.id},
            xhrFields: {
                withCredentials: false
            },
            headers: {}
        })
    }
});