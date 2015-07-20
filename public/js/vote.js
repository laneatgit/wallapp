function addVote(sender,id,vote_rank) {

    var votes =parseInt($(sender).text());
    var url = "/posts/" + id + "/up_vote";
    var icon = "<i class='fa fa-smile-o faa-tada'></i>";
    var sign = "+";
    if (vote_rank === -1)
    {
        url = "/posts/" + id + "/down_vote";
        icon = "<i class='fa fa-frown-o faa-tada'></i>";
        sign = "";
    }
    $.ajax({
	url: url,
	data: "",
	type: "POST",
	beforeSend: function(){
		$(sender).html("<img src='/img/ajax-loader.gif' />");
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
        $(sender).html(icon + sign + votes.toString());	
	}
	});
}

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
}

function findPostContainer(post_id) {
    return $(".post[data-id='" + post_id + "']");
}

function showComment(sender,post_id) {

    var url = '/posts/' + post_id + '/comments';
    var parent = $('#post_' + post_id + '_comment_area');
    var comment_region_visible = $(sender).data("comments-visible") || false;    
    if (comment_region_visible === false)
    { 
        // load comments
        $.ajax({
            url: url,
            data: "",
            dataType: "html",
            success: function(html){
                parent.append(html);
                $.data(sender, 'comments-visible', true);
                
            }
        });
    } else {
    
        // hide comments
        parent.empty();        
        $.data(sender, 'comments-visible', false);
    } 
}