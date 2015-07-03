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