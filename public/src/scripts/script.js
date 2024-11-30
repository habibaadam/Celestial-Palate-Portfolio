$(document).ready(function() {
    var lastScrollTop = 0;
    var isScrollingUp = false;

    $(".menu-icon").on("click", function() {
        $("nav ul").toggleClass("showing");
    });

    // Scrolling Effect
    $(window).on("scroll", function() {
        var st = $(this).scrollTop();

        if (st > lastScrollTop) {
            // scrolling down
            isScrollingUp = false;
        } else {
            // scrolling up
            isScrollingUp = true;
        }

        lastScrollTop = st;

        if (isScrollingUp) {
            $('nav').removeClass('black');
        } else {
            $('nav').addClass('black');
        }
    });
});



// Script for API Integration //

document.addEventListener('DOMContentLoaded', function() {
    // Selecting form, and preventing its default behavior when submitted
    let form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
      event.preventDefault();
    let message = document.querySelector('#for-message');




    // Selecting and assigning values to variables for each input field
    let firstName = form.querySelector('input[name="first-name"]');
    let lastName = form.querySelector('input[name="last-name"]');
    let email = form.querySelector('input[name="email"]');
    let phoneNumber = form.querySelector('input[name="phone-number"]');
    let numGuests = form.querySelector('input[name="num-guests"]');
    let date = form.querySelector('input[name="date-time"]');
    let amount = form.querySelector('input[name="amount"]');

   // Constructing the data object to be sent to the server
    let customer_data = {
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
        phone: phoneNumber.value
    };

    let payment_data = {
        amount: amount.value,
    };

    let reservation_data = {
        num_of_guests: numGuests.value,
        date: date.value
    };

    //console.log('Customer Data:', customer_data);
  // Post request to create a customer first
    let customer_url = 'https://celestial-backend-4fkw.onrender.com/v_2/mongo_customers/';
    fetch(customer_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer_data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
            console.error('Error details:', errorData);
            throw new Error('Failed to create customer');
        });
    }
        return response.json();
    })
    .then(data => {
        //console.log('Success:', data);

        let customer_id = data._id;

        // Post request to create a payment
        let payment_url = `https://celestial-backend-4fkw.onrender.com/v_2/mongo_payments/${customer_id}/payments`;

        fetch(payment_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payment_data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create payment');
            }
            return response.json();
        })
        .then(data => {
            //console.log('Success:', data);

            let customer_id = data.customer_id;
            let payment_id = data._id;

            let reservation_url = `https://celestial-backend-4fkw.onrender.com/v_2/mongo_reservations/${customer_id}/${payment_id}/reservations`;

            fetch(reservation_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservation_data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create reservation');
                }
                return response.json();
            })
            .then(data => {
                //console.log('Success:', data);
                message.innerHTML = 'Your reservation has been made!';
            })
        })
    })
    });
});