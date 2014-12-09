function buildCaseTr(testcase) {
	var caseTrHtml = '<td class="case-description">' + testcase.description + '</td>';
	caseTrHtml += '<td class="case-status">' + '<span class="status-unknown">UNKWOWN</span>' + '</td>';
	caseTrHtml += '<td class="case-commands">' + '<a href="javascript:void(0)" class="command-refresh-case">Refresh</a>' + '</td>';
	return caseTrHtml;
}

function buildTestTr(test) {
	var testTrHtml = '<tr class="test">'; 
	testTrHtml += '<th class="test-description">' + test.description + '</th>';
	testTrHtml += '<th class="test-status">' + '<span class="status-success">0</span> / <span class="status-failed">0</span> / <span class="status-unknown">' + test.cases.length + '</span>' + '</th>';
	testTrHtml += '<th class="test-commands">' + '<a href="javascript:void(0)" class="command-refresh-group">Refresh Group</a>' + '</th>';
	testTrHtml += '<th><a href="' + test.url + '" target="_blank">Link</a></th>'
	testTrHtml += '</tr>';
	for (var i in test.cases) {
		testTrHtml += '<tr class="case" data-case-id="' + i + '">' + buildCaseTr(test.cases[i]) + "</tr>";
	}
	return testTrHtml;
}

function buildTable() {
	var tableHtml = "";
	for (var i in pigeon.tests) {
		tableHtml += '<tbody data-test-id="' + i + '">' + buildTestTr(pigeon.tests[i]) + '</tbody>';
	}
	$('#test-results').append(tableHtml);
}

function update(testNum, caseNum, status) {
	var caseStatus = $('tbody[data-test-id=' + testNum + '] tr[data-case-id=' + caseNum + '] .case-status');
	oldVal = caseStatus.closest('tbody').children('.test').find('.status-unknown').html();
	caseStatus.closest('tbody').children('.test').find('.status-unknown').html(parseInt(oldVal)-1);
	switch (status) {
		case pigeon.STATUS_SUCCESS:
			caseStatus.html('<span class="status-success">SUCCESS</span>');
			oldVal = caseStatus.closest('tbody').children('.test').find('.status-success').html();
			caseStatus.closest('tbody').children('.test').find('.status-success').html(parseInt(oldVal)+1);
			break;
		case pigeon.STATUS_FAILED:
			caseStatus.html('<span class="status-failed">FAILED</span>');
			oldVal = caseStatus.closest('tbody').children('.test').find('.status-failed').html();
			caseStatus.closest('tbody').children('.test').find('.status-failed').html(parseInt(oldVal)+1);
			break;
		case pigeon.STATUS_ERROR:
			caseStatus.html('<span class="status-error">ERROR</span>');
			oldVal = caseStatus.closest('tbody').children('.test').find('.status-failed').html();
			caseStatus.closest('tbody').children('.test').find('.status-failed').html(parseInt(oldVal)+1);
			break;
	}
}

 
function refresh(testNum, caseNum) {
	// Если testNum не задан - выполняются все тесты
	if (typeof testNum === 'undefined') {
		for (var i in pigeon.tests) {
			refresh(i);
		}
		return;
	}
	// Если caseNum не задан - выполняется вся группа
	if (typeof caseNum === 'undefined') {
		for (var i in pigeon.tests[testNum].cases) {
			refresh(testNum, i);
		}
		return;
	}
	var caseStatus = $('tbody[data-test-id=' + testNum + '] tr[data-case-id=' + caseNum + '] .case-status');
	// Изменяем счетчик тестов
	if (caseStatus.children('span').hasClass('status-success')) {
		oldVal = caseStatus.closest('tbody').children('.test').find('.status-success').html();
		caseStatus.closest('tbody').children('.test').find('.status-success').html(parseInt(oldVal)-1);
		oldVal = caseStatus.closest('tbody').children('.test').find('.status-unknown').html();
		caseStatus.closest('tbody').children('.test').find('.status-unknown').html(parseInt(oldVal)+1);
	} else if (caseStatus.children('span').hasClass('status-failed') ||
			   caseStatus.children('span').hasClass('status-error')) {
		oldVal = caseStatus.closest('tbody').children('.test').find('.status-failed').html();
		caseStatus.closest('tbody').children('.test').find('.status-failed').html(parseInt(oldVal)-1);
		oldVal = caseStatus.closest('tbody').children('.test').find('.status-unknown').html();
		caseStatus.closest('tbody').children('.test').find('.status-unknown').html(parseInt(oldVal)+1);
	} 
	// Подгружаем loader
	$('tbody[data-test-id=' + testNum + '] tr[data-case-id=' + caseNum + '] .case-status').html('<span class="status-executing"><img src="/img/loader.gif"></span>');
	pigeon.execute(testNum, caseNum);
}

var pigeon = new Pigeon(tests, update);

$(function() {
	buildTable();

	$('.command-refresh-all').on('click', function() {
		refresh();
	});
	$('.command-refresh-group').on('click', function() { 
		refresh($(this).closest('tbody').data('test-id'));
	});
	$('.command-refresh-case').on('click', function() {
		refresh($(this).closest('tbody').data('test-id'), $(this).closest('tr').data('case-id'));
	});

	$('#hide-success').on('click', function() {
		if ($('#hide-success').prop('checked')) {
			$('.case-status .status-success').closest('tr').hide();
		} else {
			$('.case-status .status-success').closest('tr').show();
		}
	});
});
