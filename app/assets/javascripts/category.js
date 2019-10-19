$(document).on('turbolinks:load', function() {

  function appendOption(category){
    var html = `<option value="${category.name}" data-category="${category.id}">${category.name}</option>`;
    return html;
  }

  function appendChildrenBox(insertHTML){
    var childSelectHtml = "";
    childSelectHtml =　`<div class="exhibit__detail__container__title_field" id="child_wrapper">
                          <select class="select-default" id="child_category" name="category_id">
                            <option value="---" data-category="---">---</option>
                            ${insertHTML}
                          </select>
                        </div>`;
    $('.exhibit__detail__container__title__category').append(childSelectHtml);
  }

  function appendGrandchidrenBox(insertHTML){
    var grandchildSelectHtml = '';
    grandchildSelectHtml =　`<div class="exhibit__detail__container__title_field" id="grandchild_wrapper">
                              <select class="select-default" id="grandchild_category" name="category_id">
                                <option value="---" data-category="---">---</option>
                                ${insertHTML}
                              </select>
                            </div>`;
    $('.exhibit__detail__container__title__category').append(grandchildSelectHtml);
  }

  $(".exhibit__detail__container__title_field").on("change", function(){
    var parentcategory = $("#chose-category").val()
    if (parentcategory != "---"){
      $.ajax({
        url: 'category_children',
        type: 'GET',
        data: { parent_name: parentcategory },
        dataType: 'json'
      })

      .done(function(children){
        $('#child_wrapper').remove();
        $("#grandchild_wrapper").remove()
        var insertHTML = '';
        children.forEach(function(child){
          insertHTML += appendOption(child);
        });
        appendChildrenBox(insertHTML);
      })

      .fail(function(){
        alert('カテゴリー取得に失敗しました');
      })
    } else {
      $('#child_wrapper').remove();
      $("#grandchild_wrapper").remove()
    }
  })

  $(".exhibit__detail__container__title").on("change", "#child_category", function(){
    var childId = $('#child_category option:selected').data('category');
    if (childId != "---"){
      $.ajax({
        url: 'category_grandchildren',
        type: 'GET',
        data: { child_id: childId },
        dataType: 'json'
      })

      .done(function(grandchildren){
        if (grandchildren.length != 0){
          $("#grandchild_wrapper").remove()
          var insertHTML = '';
          grandchildren.forEach(function(grandchild){
            insertHTML += appendOption(grandchild);
          });
          appendGrandchidrenBox(insertHTML);
        }
      })
      .fail(function(){
        alert('カテゴリー取得に失敗しました');
      })
    } else {
      $("#child_wrapper").remove()
      $("#grandchild_wrapper").remove()
    }
  })
});