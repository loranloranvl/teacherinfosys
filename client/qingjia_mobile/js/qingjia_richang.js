$(document).ready(function() {
	// amazeui datepicker 禁用今天之前的日子
	var nowTemp = new Date();
	var nowDay = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0).valueOf();
	var nowMoth = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), 1, 0, 0, 0, 0).valueOf();
	var nowYear = new Date(nowTemp.getFullYear(), 0, 1, 0, 0, 0, 0).valueOf();
	var checkin = $('.form-datepicker').datepicker({
	    onRender: function(date, viewMode) {
	        var viewDate = nowDay;
	        switch (viewMode) {
	            case 1: viewDate = nowMoth; break;
	            case 2: viewDate = nowYear; break;
	        }
	        return date.valueOf() < viewDate ? 'am-disabled' : '';
	    }
	});
});