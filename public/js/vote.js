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


function showComment(sender,post_id) {
    
    var url = '/posts/' + post_id + '/comments';
    $.ajax({
	url: url,
	data: "",
    dataType: "html",
	success: function(data){
        $(sender).parent().parent().append(data);
        
	}
	});
    
    
    // find post_id with attribute data-id
    /*
    var div = '<div class="comment-area" data-description="Comment area">' +
                  '<div class="form-group">' +
                  　　'<h3>コメント</h3>' +
                    '<textarea class="form-control" rows="7" name="content" id="new-post-content" maxlength="255"></textarea>' +
                    '<div class="pull-right">' +
                    '    <span class="counter">' +
                    '      <span id="char-counter">255</span> 文字残り' +
                    '    </span>' +
                    '    <button  class="btn btn-primary">投稿</button>' +
                    '</div>' +
                    '<div class="clearfix">' +
                    
                  '</div>' +
                '</div>' +
                '</div>' ;
        
    $(sender).parent().parent().append($(div));
    */
    
}