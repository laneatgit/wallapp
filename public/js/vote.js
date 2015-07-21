function addVote(sender,id,vote_rank) {

    if ($(sender).hasClass('fa-disabled'))
    {
        return;
    }
    
    var votes =parseInt($(sender).text());
    var url = "/posts/" + id + "/up_vote";
    var icon = "<i class='fa fa-smile-o'></i>";
    var sign = "+";
    if (vote_rank === -1)
    {
        url = "/posts/" + id + "/down_vote";
        icon = "<i class='fa fa-frown-o'></i>";
        sign = "";
    }
    $.ajax({
	url: url,
	data: "",
	type: "POST",
	beforeSend: function(){
       $(sender).html('<i class="fa fa-refresh fa-spin"></i>');
	},
	success: function(){
        switch(vote_rank) {
            case 1:
            votes = votes+1;
            break;
            case -1:
            votes = votes-1;
            break;
        }
        setTimeout(function() {
           
            $(sender).html(icon + sign + votes.toString());
            $(sender).addClass('fa-disabled');
        },200);	
	}
	});
}
/*
function submitComment(sender,post_id) {
    
    // form.serialize() does not include hidden value, so must to add it manually.
    var form_data = 'postid=' + post_id + '&' + $('#comment-form-' + post_id + ' textarea').serialize();
    
    var url = '/comments';
    $.ajax({
	url: url,
	data: form_data,
    type: "POST",
    dataType: "html",
	success: function(html){
        // get user info from client cookies?


	}
	});
}*/

function findPostContainer(post_id) {
    return $(".post[data-id='" + post_id + "']");
}

function showComment(sender,post_id) {

    var url = '/posts/' + post_id + '/comments';
    var parent = $('#post_' + post_id + '_comment_area');
    var comment_region_visible = $(sender).data("comments-visible") || false; 
    var $icon = $('#post-id-' + post_id + '  .fa-comment').parent();   
    var icon_html =  $icon.html();  
    if (comment_region_visible === false)
    { 
        // load comments
        $.ajax({
            url: url,
            data: "",
            dataType: "html",
            beforeSend: function(){
               $icon.html('<i class="fa fa-refresh fa-spin"></i>');
            },
            success: function(html){
                setTimeout( function() {
                    parent.append(html);
                    $.data(sender, 'comments-visible', true);
                    $icon.html(icon_html);
                }, 200);
            }
        });
    } else {
    
        // hide comments
        parent.empty();        
        $.data(sender, 'comments-visible', false);
    } 
}