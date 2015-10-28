var addPostButton = document.getElementById('js-id-add-post-button'),
  cancelButton = document.getElementById('js-id-cancel-button'),
  addPostForm = document.getElementById('js-id-add-post-form'),

  photoIcon = document.getElementById('js-id-icon-photo'),
  photoInput = document.getElementById('js-id-input-upload-photo');

var postForm = {
  show: function () {
    addPostButton.style.display = 'none';
    addPostForm.style.display = '';
  },
  hide: function () {
    addPostButton.style.display = '';
    addPostForm.style.display = 'none';
  }
}
if (addPostButton) addPostButton.addEventListener('click', postForm.show);

if (cancelButton) {
  cancelButton.addEventListener('click', postForm.hide);

  photoIcon.addEventListener('click', function () {
    photoInput.click();
  });

  photoInput.addEventListener('change', function () {
    var formData = new FormData($(this).closest('form')[0]);
    $.ajax({
      url: '/posts/upload/', 
      type: 'POST',
      beforeSend: function () {
        $('#js-id-mask').addClass('active');
      },
      success: function (response) {
        editor.insertEmbed(editor.getLength(), 'image', response);
        $('#js-id-mask').removeClass('active');
      },
      error: $.noop,
      data: formData,
      cache: false,
      contentType: false,
      processData: false
    });
  });
}

try {
  if (typeof(editor) != 'object') window.editor = new Quill('#id-post-editor');
}
catch (e) {
  console.log(e)
}

function checkPostForm (form) {
  var titleInput = document.getElementById('id_title'),
    contentTextarea = document.getElementById('id_content');
  if (titleInput.value == '') {
    titleInput.parentElement.className = 'field error';
    titleInput.focus();
    return false;
  }
  contentTextarea.value = editor.getHTML();
}