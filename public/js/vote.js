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
    
    var ejs_url = '/_comments.ejs';
    var data_url = '/posts/' + :post_id + '/comments';
    
    // Grab the template
    $.get(ejs_url, function (template) {
        // Compile the EJS template.
        var func = ejs.compile(template);

        // Grab the data
        $.get(data_url, function (data) {
           // Generate the html from the given data.
           var html = func(data);
           
           
           $('#divResults').html(html);
           
           
        });
    });
    
    
    // find post_id with attribute data-id
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
    
    
}