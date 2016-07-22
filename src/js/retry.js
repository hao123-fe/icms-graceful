function retry(retryList, $node) {
    if (!retryList.length) {
        return
    }
    var taskId = retryList[0][0]
    var method = retryList[0][1]
    var hostname = JSON.parse(retryList[0][2])
    var formData = new FormData()
    formData.append('method', method)
    formData.append('hostname', encodeURIComponent(hostname))
    fetch('?action=control_machine&taskid=' + taskId, {
        method: 'POST',
        body: 'method=' + method + '&hostname=' + hostname,
        credentials: 'include',
        enctype: 'application/x-www-form-urlencoded',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(res => res.ok && res.json())
        .then(json => {
            if (json.result && !json.soap_result) {
                // success
            } else {
                // failed
                $node.css({color: 'red'})
            }
            var count = $node.data('retry-count')
            $node.val((count - retryList.length + 1) + ' / ' + count)
            retryList.shift()
            retry(retryList, $node)
        })
}

module.exports = retry
