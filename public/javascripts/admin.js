let openFlightDataModal = () => {}
let openScoresheetDataModal = () => {}
let openUserDataModal = () => {}

let updateFlightData = () => {}
let updateScoresheetData = () => {}
let updateUserData = () => {}

const Users = {}
const Scoresheets = {}
const Flights = {}
const fetchAllData = () => {
	return fetch('/admin/alldata').then(response => {
		return response.json()
	}).then(({scoresheets, flights, users})=> {
		users.forEach(user => {
			Users[user.id] = user
		})
		flights.forEach(flight => {
			Flights[flight.id] = flight
		})
		scoresheets.forEach(scoresheet => {
			Scoresheets[scoresheet.id] = scoresheet
		})
	})
}

const updateAllTables = () => {
	fetchAllData().then(() => {
		updateTable('#scoresheets', Scoresheets)
		updateTable('#judges', Users)
		updateTable('#flights', Flights)

		$("#flightModalUser").html("<option selected disabled>Select...</option>")
		Object.values(Users).forEach(user => {
			$("#flightModalUser").append(new Option(user.email, user.id))
		})
	})
}

const updateTable = (tableId, datalist) => {
	const dataKeys = []
	let htmlOut = ''
	$(tableId).find('[data-key]').each((idx, val) => {
		dataKeys.push($(val).attr('data-key'))
	})
	Object.values(datalist).forEach(listing => {
		htmlOut += (`<tr>
			${dataKeys.map((val, idx) =>  {
				if (idx === 0) {
					return `<td><a class="link-style" role="button" onclick="openDataModal('${tableId}','${listing.id}')"> ${val.split(',').map(key => listing[key]).join(' ')} </a></td>`
				} else {
					return `<td> ${val.split(',').map(key => listing[key]).join(' ')} </td>`
				}
			}).join('')}
		</tr>`)
	})
	$(tableId).find('tbody').html(htmlOut)
	$(tableId).find('table').DataTable().destroy()
	$(tableId).find('table').DataTable()
}

const openDataModal = (tableId, id) => {
	if (tableId === '#scoresheets') {
		openScoresheetDataModal(id)
	} else if (tableId === '#judges') {
		openUserDataModal(id)
	} else if (tableId === '#flights') {
		openFlightDataModal(id)
	}
}

const closeAllModals = () => {
	$('#flightDataModal').modal('hide')
	$('#scoresheetDataModal').modal('hide')
	$('#userDataModal').modal('hide')
}

$(() => {
	updateAllTables()

	openFlightDataModal = (flightId) => {
		const flight = Flights[flightId]
		if (!flight) return
		closeAllModals()

		const flightScoresheetsHtml = Object.values(Scoresheets).filter(scoresheet => scoresheet.flight_key === flightId).map(scoresheet => generateScoresheetModalTableRow(scoresheet)).join('')
		
		$('#flightModalName').val(flight.flight_id)
		$('#flightModalName').attr('flight-id', flight.id)
		$('#flightModalLocation').val(flight.location)
		$('#flightModalLocation').prop('disabled', flight.submitted)
		$('#flightModalDate').val(flight.date.slice(0,10))
		$('#flightModalDate').prop('disabled', flight.submitted)
		$('#flightModalUser').val(flight.created_by)
		$('#flightModalUser').prop('disabled', flight.submitted)
		$('#flighModalSubmitted').prop('checked', flight.submitted)
		$('#flightModalEntries').html(flightScoresheetsHtml)

		$('#flightDataModal').modal('show')
	}

	openScoresheetDataModal = (scoresheetId) => {
		const scoresheet = Scoresheets[scoresheetId]
		if (!scoresheet) return
		closeAllModals()

		$('#scoresheetModalId').text(JSON.stringify(scoresheet))

		$('#scoresheetDataModal').modal('show')		
	}

	openUserDataModal = (userId) => {
		const user = Users[userId]
		if (!user) return
		const flights = Object.values(Flights).filter(flight => flight.created_by === userId)
		const scoresheets = Object.values(Scoresheets).filter(scoresheet => scoresheet.user_id === userId)
		closeAllModals()

		$('#userModalId').text(JSON.stringify(user))


		$('#userDataModal').modal('show')
	}

	updateFlightData = () => {
		const submitted = $(flighModalSubmitted).attr('checked')
		const updatedFlightData = {
			flightId : $('#flightModalName').attr('flight-id'),
			flightName: $('#flightModalName').val(),
			submitted: $('#flighModalSubmitted').prop('checked'),
			flightDate: new Date($('#flightModalDate').val()),
			createdBy: $('#flightModalUser').val(),
			flightLocation: $('#flightModalLocation').val(),
		}

		fetch('/flight/edit/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updatedFlightData)
		}).then(data => {
			updateScoresheetDataFromFlightModal(submitted)
		})
		.catch(err => {
			console.error('Could not update flight #' + updatedFlightData.flightId)
		})

		
	}

	updateScoresheetDataFromFlightModal = (submitted) => {
		const fetchPromises = []

		$('.flight-modal-scoresheet-row').each((idx, flightScoresheetRow) => {
			const updatedScoresheetData = {
				id: $(flightScoresheetRow).attr('scoresheet-id'),
				_ajax: "true",
				consensus_score: $(flightScoresheetRow).find('.flight-modal-consensus').val(),
				place: $(flightScoresheetRow).find('.flight-modal-place').val(),
				mini_boss_advanced: $(flightScoresheetRow).find('.flight-modal-bos-advance').val(),
				scoresheet_submitted: submitted
			}

			fetchPromises.push(
				fetch('/scoresheet/update/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(updatedScoresheetData)
				})
				.catch(err => {
					console.error('Could not update scoresheet entry #' + $(flightScoresheetRow).find('.flight-modal-open-scoresheet-modal-button').text())
				})
			)
		})

		Promise.allSettled(fetchPromises).then(() => {
			closeAllModals()
			updateAllTables()
		})
	}

	const generateScoresheetModalTableRow = (scoresheet) => {
		return `
		<tr class="flight-modal-scoresheet-row" scoresheet-id="${scoresheet.id}">
			<td scope="row">
				<a role="button" class="link-style flight-modal-open-scoresheet-modal-button" onclick=openScoresheetDataModal("${scoresheet.id}")>${scoresheet.entry_number}</a>
			</td>
			<td>${scoresheet.category + scoresheet.sub} - ${scoresheet.subcategory}</td>
			<td class="text-center">
				<input class="form-control form-control-sm text-center" type="number" value="${scoresheet.judge_total}" disabled />
			</td>
			<td class="text-center">
				<input class="form-control form-control-sm text-center flight-modal-consensus" type="number" value="${scoresheet.consensus_score}"  ${scoresheet.scoresheet_submitted ? 'disabled' : ''}/>
			</td>
			<td class="text-center">
				<select class="form-control form-control-sm flight-modal-place"  ${scoresheet.scoresheet_submitted ? 'disabled' : ''}>
					<option>-</option>
					<option value="0" ${scoresheet.place === 0 ? 'selected' : ''}>Advance</option>
					<option value="1" ${scoresheet.place === 1 ? 'selected' : ''}>1st</option>
					<option value="2" ${scoresheet.place === 2 ? 'selected' : ''}>2nd</option>
					<option value="3" ${scoresheet.place === 3 ? 'selected' : ''}>3rd</option>
				</select>
			</td>
			<td class="text-center">
				<input class="form-check-input position-static m-0 flight-modal-bos-advance" type="checkbox" autocomplete="off" checked=${scoresheet.mini_boss_advanced}  ${scoresheet.scoresheet_submitted ? 'disabled' : ''}/>
			</td>
			<td class="text-center">
				<button class="btn btn-success btn-sm flight-modal-download-button" type="button" ${scoresheet.scoresheet_submitted ? '' : 'disabled'}>📄</button>
			</td>
		</tr>
		`
	}
})