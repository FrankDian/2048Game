/**
 * Created by FrankDian on 2016/08/01
 * @description 用来给格子运动添加动画效果的函数文件
 */

//动画显示新生成的数字
function showNumberWithAnimation(i,j,randNumber){
	var numberCell = $('#number-cell-' + i + "-" + j);
	
	numberCell.css('background-color',getNumberBackgroundColor(randNumber));
	numberCell.css('color',getNumberColor(randNumber));
	numberCell.text( randNumber );
	//动画显示
	numberCell.animate({
		width:cellSideLength,
		height: cellSideLength,
		top: getPosTop(i,j),
		left: getPosLeft(i,j)
	},50);
	
}

//显示块的运动，从(fromx , fromy)到(tox , toy)
function showMoveAnimation( fromx , fromy , tox , toy ){
	var numberCell = $('#number-cell-' + fromx + '-' + fromy );
    numberCell.animate({
        top:getPosTop( tox , toy ),
        left:getPosLeft( tox , toy )
    },200);
}
//更新分数
function updateScore( score ){
	$("#score").text(score);
}
