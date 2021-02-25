module.exports = function(RED) {
    function IoBoardOutputNode(config) {
        RED.nodes.createNode(this,config);
        this.board = config.board;
        this.MAC = config.MAC;
		this.state = config.state;
		this.relay = config.relay
		// this.ioplugin = RED.nodes.getNode(n.board);
        var node = this;
        this.on('input', function(msg) {
        	// console.log({node,msg})
        	// {"model":"ioBoard","nFunction":"setRLY1","arguments":["IOBOARD-v1","MICROID-05RO",false]}
        	var state = config.state;
        	var board = node.board;
        	var MAC = node.MAC;
        	if(state == "boolean" || state == "msg.payload") state = msg.payload;

        	if(state =="ON" || state == true || state =="true" || state == 1){
        		state = true
			}else if(state =="OFF" || state == false || state =="false" || state == 0){
        		state = false
        	}else if(state == "STATUS"){
        		state = "STAT"
        	}else{
        		state = false
        	}

        	var relay = config.relay || "";

        	if(state=="STAT"){
        		// getBoardStatus
				msg.payload = {model:"ioBoard",nFunction:"getBoardStatus",arguments:[board,MAC]};
        	}else{
        		msg.payload = {model:"ioBoard",nFunction:"setOnlyRelay",arguments:[board,MAC,state,relay]};
        	}
            
            msg.service = "socketiot/ioBoardApi/";
            // console.log(msg)
            // msg.payload = {name:node.name,board:node.board,state:node.state,MAC:node.MAC}
            node.send(msg);
        });
    }
    RED.nodes.registerType("IO-Board-Output",IoBoardOutputNode);
}