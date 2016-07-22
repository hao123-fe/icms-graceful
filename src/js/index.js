require('./init.js')

var $ = require('jquery')
var retry = require('./retry.js')

$(function () {
    var $toolbar = $('.lineL').eq(0)
    var $retryAll = $('<input class="cmsbutton" data-action="retry-all" name="refresh" type="button" value="全部重试">')
    if ($('#machinelist > tr > td:nth-child(4) > a:nth-child(1)').eq(0).text() === '重试') {
        $toolbar.append($retryAll)
    }
    $toolbar.on('click', '[data-action=retry-all]', function () {
        var $this = $(this)
        retryAll($this)
    })

    function retryAll($node) {
        var retryList = getFailedList()
        $node.attr('disabled', true)
        $node.data('retry-count', retryList.length)
        retry(retryList, $node)
    }

    function getFailedList() {
        var retryList = []
        $('#machinelist > tr > td:nth-child(4) > a:nth-child(1)').each(function () {
            var $this = $(this)
            var paramStr = $this.attr('onclick').replace(/(processFailed\()|\)/g,'')
            var param = paramStr.split(',')
            param[0] = parseInt(param[0])
            param[1] = parseInt(param[1])
            retryList.push(param)
        })
        $retryAll.val('0 / ' + retryList.length)
        return retryList
    }
})
