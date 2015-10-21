/**
 * Created by liuyubobobo on 14-4-11.
 * my site: http://www.liuyubobobo.com
 */

var board = new Array();
var score = 0;
var hasboard = new Array();
$(document).ready(function() {
	prepareForMobile();
    newgame();
});

function prepareForMobile(){
	if(documentWidth > 500){
		gridContainerWidth = 500;
		cellSpace=20;
		cellSideLength=100;	
	}
	$("#grid-container").css('width',gridContainerWidth-2*cellSpace);
	$("#grid-container").css('height',gridContainerWidth-2*cellSpace);
	$("#grid-container").css('padding',cellSpace);
	$("#grid-container").css('border-radius',0.02*gridContainerWidth);
	$(".grid-cell").css('width',cellSideLength);
	$(".grid-cell").css('height',cellSideLength);
	$(".grid-cell").css('border-radius',0.02*cellSideLength);
}

function newgame(){
	//初始化 
	init();
	//在随机两个格子生成数字
	gemerateOneNumber();
	gemerateOneNumber();	
}

function init(){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var gridCell=$("#grid-cell-"+i+"-"+j);
            gridCell.css('top', getPosTop( i , j ) );
            gridCell.css('left', getPosLeft( i , j ) );
			//console.log(gridCell);
		}
	}
	for(var i=0;i<4;i++){
		board[i]=new Array();
		hasboard[i]=new Array();
		for(var j=0;j<4;j++){
			board[i][j]=0;
			hasboard[i][j]=false;
			}
		}
	updateBoardView();
	score = 0;
	updatescore(score);
}
function updateBoardView(){

    $(".number-cell").remove();
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
            $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if( board[i][j] == 0 ){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2 );
                theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2 );
            }
            else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );
                theNumberCell.css('color',getNumberColor( board[i][j] ) );
                theNumberCell.text( board[i][j] );
            }
			hasboard[i][j]=false;
        }
	$('.number-cell').css('line-height',cellSideLength+'px');
	$('.number-cell').css('font-size',0.6*cellSideLength+'px');
}
function gemerateOneNumber(){
	
	if(nospace(board)){
		return false;
	}
	//随机一个位置
	var randx = parseInt(Math.floor(Math.random()*4));
	var randy = parseInt(Math.floor(Math.random()*4));
	var time=0;
	while(time<50){
		if(board[randx][randy]==0){
			break;	
		}
		var randx = parseInt(Math.floor(Math.random()*4));
		var randy = parseInt(Math.floor(Math.random()*4));
		time++;
	}
	if(time=50){
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				if(board[i][j]==0){
					randx=i;
					randy=j;	
				}	
			}	
		}	
	}
	//随机一个数字
	var randNumber = Math.random() < 0.5 ? 2 : 4;
	//随机位置显示数字
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx,randy,randNumber);
	return true;
	
}
$(document).keydown(function(event){
	
	switch (event.keyCode){
		case 38:		//up
		event.preventDefault();
			if(moveUp()){
				setTimeout("gemerateOneNumber()",210);
				setTimeout("isgameover()",310);	
			}		
		break;
		case 37:		//left
		event.preventDefault();
			if(moveLeft()){
				setTimeout("gemerateOneNumber()",210);
				setTimeout("isgameover()",310);		
			}
		break;
		case 39:		//right
		event.preventDefault();
			if(moveRight()){
				setTimeout("gemerateOneNumber()",210);
				setTimeout("isgameover()",310);	
			}
		break;
		case 40:		//down
		event.preventDefault();
			if(moveDown()){
				setTimeout("gemerateOneNumber()",210);
				setTimeout("isgameover()",310);	
			}
		break;
	}
});

document.addEventListener("touchstart",function(event){

	startx=event.touches[0].pageX;
	starty=event.touches[0].pageY;
	//console.log(startx);
});

document.addEventListener("touchmove",function(event){
	event.preventDefault();
});
document.addEventListener("touchend",function(event){

	endx=event.changedTouches[0].pageX;
	endy=event.changedTouches[0].pageY;
	
	var deltax = endx-startx;
	var deltay = endy-starty;
	if(Math.abs(deltax)<0.3*documentWidth && Math.abs(deltay)<0.3*documentWidth){
		return;	
	}
	if(Math.abs(deltax)>=Math.abs(deltay)){
		if(deltax>0){
			//move right
			if(moveRight()){
				setTimeout("gemerateOneNumber()",210);
				setTimeout("isgameover()",310);	
			}	
		}else{
			//move left	
			if(moveLeft()){
				setTimeout("gemerateOneNumber()",210);
				setTimeout("isgameover()",310);		
			}
		}
	}else{
		if(deltay>0){
			//move down
			if(moveDown()){
				setTimeout("gemerateOneNumber()",210);
				setTimeout("isgameover()",310);	
			}
		}else{
			if(moveUp()){
				setTimeout("gemerateOneNumber()",210);
				setTimeout("isgameover()",310);	
			}	
			//move up
		}
	}
});
function isgameover(){
	if(nospace(board) && nomove(board)){
		gameover();	
	}
}

function gameover(){
	alert("游戏结束");	
}

function moveLeft(){
	if(!canMoveLeft(board)){//判断是否可以移动
		return false;
	}
	//实现移动
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(board[i][j]!=0){
				for(var k=0;k<j;k++){
					if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){//判断是否j前面的k没有数字并且没有障碍物
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board) && !hasboard[i][k]){//判断是否j和前面的k相同并且没有障碍物
						showMoveAnimation(i,j,i,k);
						board[i][k]+=board[i][j];
						board[i][j]=0;
						score += board[i][k];
						hasboard[i][k]=true;
						updatescore(score);
						anp(board[i][k]);	
						continue;
					}
				}
			}	
		}	
	}
	setTimeout("updateBoardView()",200);
	return true;
}

function moveRight(){
	if(!canMoveRight(board)){//判断是否可以移动
		return false;
	}
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){
			if(board[i][j]!=0){
				for(var k=3;k>j;k--){
					if(board[i][k]==0 && noBlockHorizontal(i,j,k,board)){
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;	
					}else if(board[i][k]==board[i][j] && noBlockHorizontal(i,j,k,board) && !hasboard[i][k]){
						showMoveAnimation(i,j,i,k);
						board[i][k]+=board[i][j];
						board[i][j]=0;
						score += board[i][k];
						hasboard[i][k] = true;
						updatescore(score);
						anp(board[i][k]);	
						continue;
					}
				}
			}	
		}	
	}
		setTimeout("updateBoardView()",200);
	return true;
}

function moveUp(){

    if( !canMoveUp( board ) )
        return false;

    //moveUp
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ ){
            if( board[i][j] != 0 ){
                for( var k = 0 ; k < i ; k ++ ){

                    if( board[k][j] == 0 && noBlockVertical( j , k , i , board ) ){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , k , i , board ) && !hasboard[k][j] ){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
						score += board[k][j];
						hasboard[k][j]= true;
						updatescore(score);
						anp(board[k][j]);	
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    if( !canMoveDown( board ) )
        return false;

    //moveDown
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > i ; k -- ){

                    if( board[k][j] == 0 && noBlockVertical( j , i , k , board ) ){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , i , k , board ) && !hasboard[k][j]){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
						score += board[k][j];
						hasboard[k][j]= true;
						updatescore(score);
						anp(board[k][j]);	
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function updatescore(score){
	$("#score").text(score);
}





