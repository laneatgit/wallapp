function addVote(sender,id,vote_rank) {

    var votes =parseInt($(sender).text());
    var url = "/posts/" + id + "/up_vote";
    var icon = "<i class='icon-smile'></i>";
    var sign = "+";
    if (vote_rank === -1)
    {
        url = "/posts/" + id + "/down_vote";
        icon = "<i class='icon-frown'></i>";
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

function submitComment(sender, post_id) {
    var url = '/comments';
    var parent = $(sender).parent().parent();
    $.ajax({
	url: url,
	data: $("#comment-form-" + String(post_id)).serialize(),
    type: "POST",
    dataType: "html",
	success: function(html){
        //parent.append(html);
	}
	});
}

function findPostContainer(post_id) {
    return $(".post[data-id='" + post_id + "']");
}

function showComment(sender,post_id) {

    var url = '/posts/' + post_id + '/comments';
    var parent = findPostContainer(post_id);
    var comment_region_visible = $(sender).data("comments-visible");
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
    } 
}