'use strict';

const timeDelayShort = 1200;

$(document).ready(function() {
    // Initialize dropdowns
    $('.dropdown-toggle').dropdown();

    // User comments post click handler
    $('#form-comment button').on('click', (e) => {
        e.preventDefault();

        // Get article id and post for comment storage
        let post = document.getElementById('post').value;
        let articleRef = document.getElementById('articleRef').value;
        console.log('id: ' + articleRef + 'post: ' + post);

        // Capture errors
        let errorArr = [];
        if(post == '') {
            errorArr.push('You must enter a valid comment!\n');
        }

        // Show error notification if there are errors
        if (checkErrors(errorArr)) {
            return false;
        }

        initializeSpinner();

        let formData = 'post=' + post + '&articleRef=' + articleRef;

        $.ajax({
            type: 'POST',
            url: '/news/comment',
            data: formData,
        }).done(html => {
            setTimeout(() => {
                if (html) {
                    removeSpinner();
                    // Append new <blockquote> to #comment-blocks div
                    $('#comment-blocks').append(html);
                    // Empty out the <textarea> text
                    $('textarea').val('');
                    // Show success notification
                    notify('textarea', 'Your comment was added!', 'success', 'top right');
                }
            }, timeDelayShort);
        });
    });

    // Delete comment click handler
    $('#comment-blocks').on('click', 'blockquote a', function(e) {
        e.preventDefault();

        let postId = $(this).data('id');
        console.log('postId: ' + postId);

        if (!postId) {
            showAlertModal('There was an error processing your request!');
            return false;
        }

        // Confirm delete
        //if (processConfirmModal)

        let formData = 'postId=' + postId;

        initializeSpinner();

        $.ajax({
            type: 'POST',
            url: '/news/removeComment',
            data: formData,
        }).done((response) => {
            setTimeout(() => {
                removeSpinner();
                if (response == 'success') {
                    // Remove the <blockquote> and the <label>
                    $(this).parent().parent().remove();
                    // Show success message
                    notify('blockquote', 'Comment removed successfully!', 'success', 'top left');
                }
            }, timeDelayShort);
        });
    });

    // TODO: preventDefault() is not working correctly.  Find out why.
    $('.news-content-link').on('click', 'a', (e) => {
        e.preventDefault();
        //e.stopImmediatePropagation();

        // Get name to determine route action.  Matches the routes.
        let route = $(this).data('route');
        let url = '/news/' + route;
        let msg = '';

        // Set alert message based on route
        if (route == 'add') {
            msg = 'News was added successfully!';
        } else {
            msg = 'News was removed successfully!';
        }

        initializeSpinner();

        $.ajax({
            type: 'POST',
            url,
        }).done((response) => {
            setTimeout(() => {
                removeSpinner();
                if (response == 'success') {
                    // Fill in and show alert modal
                    showAlertModal(msg);
                } else {
                    showAlertModal('There was an error processing your request!');
                }
            }, timeDelayShort);
        });
        return false;
    });

    // Show form errors if any occurred
    function checkErrors(errorArr, notify) {
        if (errorArr.length > 0) {
            var msg = '';
            errorArr.forEach(function (error) {
                msg += error;
            });
            // Show error notification based on alertType ('modal' or 'notify')
            if (notify) {
                notify('', msg, 'error', 'right');
            } else {
                showAlertModal(msg);
            }
            return true;
        } else {
            return false;
        }
    }

    // Return globally-positioned notification
    function notify(element, msg, type, position) {
        return $(element).notify(
            msg,
            type,
            {
                position: position,
                autoHideDelay: 5000
            }
        );
    }

    function showConfirmModal(msg) {
        // Fill in values
        $('#confirm-modal-msg').text(msg);
        // Show the modal
        $('#confirm-modal').modal('show');
    }

    // Attach confirm modal click handler ONLY ONCE (.one) for every confirmation process
    /*
    function processConfirmModal() {
        $('#confirm-modal button').one('click', (e) => {
            // Get type of button clicked
            let buttonType = $(this).data('type');
            if (buttonType == 'cancel') {
                $('#confirm-modal').modal('hide');
                return false;
            } else {
                $('#confirm-modal').modal('hide');
                return true;
            }
        });
    }*/

    function showAlertModal(msg) {
        // Fill in values
        $('#alert-modal-msg').text(msg);
        // Show the modal
        $('#alert-modal').modal('show');
    }

    // Load the spinner
    function initializeSpinner() {
        $('div.spinner-div').html('<div class="spinner">Loading...</div>');
    }

    // Remove the spinner
    function removeSpinner() {
        $('div.spinner-div').empty();
    }
    //let imgUrl = $('#article-img').attr('')
    //$('#article-img').backstretch
});