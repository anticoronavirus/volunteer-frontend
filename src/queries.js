import gql from 'graphql-tag'

export const me = gql`{
  me {
    uid
    fname
    mname
    lname
    phone
    email
    comment
    profession
    car
    licenceplate
    managedHospital {
      uid
      shortname
    }
  }
}`

export const hospital = gql`
query hospital($uid: uuid!) {
  hospital: hospital_by_pk(uid: $uid) {
    uid
    shortname
    name
    address
    directions
  }
  me {
    uid
    phone
    managedHospitals (where: { hospital: { uid: { _eq: $uid }}}) {
      coophone
    }
  }
}`

export const hospitalPeriods = gql`
query hospitalPeriods($hospitalId: uuid!) {
  hospital: hospital_by_pk(uid: $hospitalId) {
    uid
    periods {
      uid
      start
      end
      profession_id
      demand
      notabene
      profession {
        uid
        name
      }
    }
  }
}`

export const professions = gql`
query professions($where: profession_bool_exp) {
  professions: profession(where: $where) {
    uid
    name
    description
    requirements
    dangerous
  }
}`

export const requirements = gql`
query requirements($where: hospital_profession_requirement_bool_exp) {
  requirements: requirement {
    uid
    name
    required: hospital_profession_requirements(where: $where) {
      uid
    }
  }
}`

export const addProfessionRequirement = gql`
mutation addProfessionRequirement(
  $hospitalId: uuid! 
  $requirementId: uuid!
  $professionId: uuid
) {
  toggle: insert_hospital_profession_requirement(objects: [{
    hospital_id: $hospitalId
    requirement_id: $requirementId
    profession_id: $professionId
  }]) {
    returning {
      uid
      requirement {
        uid
        required: hospital_profession_requirements(where: {
          hospital_id: { _eq: $hospitalId }
          profession_id: { _eq: $professionId  }
        }) {
          uid
        }
      }
    }
  }
}
`

export const removeProfessionRequirement = gql`
mutation removeProfessionRequirement(
  $hospitalId: uuid! 
  $professionId: uuid!
  $uid: uuid!
) {
  toggle: delete_hospital_profession_requirement(where: { uid: { _eq: $uid } }) {
    returning {
      uid
      requirement {
        uid
        required: hospital_profession_requirements(where: {
          hospital_id: { _eq: $hospitalId }
          profession_id: { _eq: $professionId }
        }) {
          uid
        }
      }
    }
  }
}
`

export const updateVolunteer = gql`
mutation UpsertVolunteer(
  $uid: uuid!
  $data: volunteer_set_input!
) {
  update_volunteer(
    _set: $data
    where: {
      uid: { _eq: $uid }
    }) {
    returning {
      uid
      fname
      mname
      lname
      phone
      email
      comment
    }
  }
}
`

export const myShifts = gql`
subscription {
  volunteer_shift {
    uid
    date
    start
    end
    confirmed
    hospital {
      uid
      shortname
    }
  }
}
`

export const volunteerShiftCount = gql`{
  volunteer_shift_aggregate {
    aggregate{
      count
    }
  }
}`

export const exportShifts = gql`
query exportShifts($hospitalId: uuid) {
  volunteer_shift(
    where: {
      confirmed: {
        _eq: true
      }
      hospital_id: {
        _eq: $hospitalId
      }
    },
    order_by: {
      date: desc
      start: desc
  }) {
    date
    start
    end
    confirmed
    volunteer {
      lname
      fname
      mname
      phone
      profession
      email
      provisioned_documents {
        uid
      }
    }
  }
}`

export const exportCars = gql`
query exportCars($hospitalId: uuid) {
  volunteer_shift(
    where: {
      confirmed: {
        _eq: true
      }
      hospital_id: {
        _eq: $hospitalId
      }
      volunteer: {
        licenceplate: {
          _neq: null
        }
      }
    },
    order_by: {
      date: desc
      start: desc
  }) {
    volunteer {
      fname
      mname
      lname
      car
      licenceplate
    }
  }
}`

export const addVolunteerToShift = gql`  
mutation addVolunteerToShift(
  $userId: uuid
  $professionId: uuid
  $date: date
  $start: timetz
  $end: timetz
  $hospitalId: uuid
) {
  insert_volunteer_shift(objects: [{
    volunteer_id: $userId
    profession_id: $professionId
    date: $date
    start: $start
    end: $end
    hospital_id: $hospitalId
  }]) {
    returning {
      uid
      confirmed
      hospital {
        uid
        shortname
      }
    }
  }
}
`

export const addProfessionRequest = gql`
mutation addProfessionRequest(
  $hospitalId: uuid!
  $userId: uuid!
  $professionId: uuid!
  ) {
    insert_profession_request(objects: [{
      hospital_id: $hospitalId
      volunteer_id: $userId
      profession_id: $professionId
    }]) {
      returning {
        uid
      }
    }
}`

export const removeVolunteerFromShift = gql`
mutation removeVolunteerFromShift($uid: uuid) {
  delete_volunteer_shift(where: { uid: { _eq: $uid }}) {
    affected_rows
  }
}
`

export const shiftFragment = gql`
fragment shift on vshift {
  date
  start
  end
  demand
  hospitalscount
  placesavailable
  demand
  shiftRequests(where: { volunteer_id: { _eq: $userId }}) {
    uid
    confirmed
    hospital {
      uid
      shortname
    }
  }
}
`

export const directions = gql`
query directions($hospitalId: uuid!) {
  hospital: hospital_by_pk(uid: $hospitalId) {
    uid
    directions
  }
}`

export const shifts = gql`
query shifts($hospitalId: uuid $userId: uuid $taskId: _uuid) {
  shifts: shift_selector(args: { _hospital_id: $hospitalId, professions: $taskId }) {
    ...shift
  }
}
${shiftFragment}`

export const shiftsSubscription = gql`
subscription shiftsSubscription($hospitalId: uuid $userId: uuid $taskId: _uuid) {
  shifts: shift_selector(args: { _hospital_id: $hospitalId, professions: $taskId }) {
    ...shift
  }
}
${shiftFragment}`

const hospitalShiftFragment = gql`
fragment hospitalShiftFragment on vshift {
  date
  start
  end
  placesavailable
  demand
  periods(where: {
    hospital_id: { _eq: $hospitalId }
  }) {
    uid
    demand
    start
    end
    profession {
      uid
      name
    }
  }
  shiftRequests(where: {
    hospital_id: { _eq: $hospitalId }
    profession: {
      periods: {
        hospital_id: { _eq: $hospitalId }
      }
    }
  }) {
    uid
    date
    start
    end
    confirmed
    profession_id
    volunteer {
      uid
      fname
      lname
      fname
      phone
      profession
      provisioned_documents_aggregate {
        aggregate {
          count
        }
      }
    }
  }
}`

export const hospitalShiftsSubscription = gql`
subscription shifts($hospitalId: uuid) {
  shifts: shift_selector(args: { _hospital_id: $hospitalId }) {
    ...hospitalShiftFragment
  }
}
${hospitalShiftFragment}`

export const hospitalShiftsQuery = gql`
query shifts($hospitalId: uuid) {
  shifts: shift_selector(args: { _hospital_id: $hospitalId }) {
    ...hospitalShiftFragment
  }
}
${hospitalShiftFragment}`

export const documentsProvisioned = gql`
mutation documentsProvisioned(
  $hospitalId: uuid
  $volunteerId: uuid
) {
  insert_provisioned_document(objects: [{ hospital_id: $hospitalId volunteer_id: $volunteerId}]) {
    affected_rows
  }
}`

export const flipConfirm = gql`
mutation FlipConfirm(
  $confirmed: Boolean
  $volunteer_id: uuid
  $shift_id: uuid
) {
  update_volunteer_shift(
    _set: { confirmed: $confirmed }
    where: {
      volunteer_id: { _eq: $volunteer_id }
      shift_id: { _eq: $shift_id }
      }
  ) {
    returning {
      shift_id
      volunteer_id
      confirmed
    }
  }
}`

export const hint = gql`
query hint ($name: String!) {
  me { uid }
  hint (where: { name: { _eq: $name }}) {
    uid
    text
  } 
}
`

export const seenHint = gql`
mutation seenHint($userId: uuid! $hintId: uuid!) {
  insert_seen_hint(objects: [{ user_id: $userId hint_id: $hintId }]) {
    affected_rows
  }
}`

export const hospitals = gql`{
  hospitals: hospital {
    uid
    shortname
    address
    periods { demand }
  }
}`

export const filteredHospitals = gql`
query filteredHospitals(
  $start: timetz
  $end: timetz
) {
  hospitals: hospital(where: {
    shortname: { _neq: "Коммунарка" } ## FIXME
    periods: { 
      start: { _eq: $start }
      end: { _eq: $end }
  } }) {
    uid
    shortname
    address
  }
}`

export const professionRequests = gql`
query professionRequests($hospitalId: uuid!) {
  requests: profession_request(where: {
    hospital_id: { _eq: $hospitalId }
  }) {
    uid
    profession {
      uid
      name
    }
    volunteer {
      uid
      fname
      lname
      phone
    }
    requirements {
      uid
      requirement {
        uid
        name
      }
    }
  }
}`

export const filteredHospitalProfessions = gql`
  query filteredHospitalProfessions(
    $hospitalId: uuid!
    $start: timetz
    $end: timetz
    $userId: uuid
  ) {
    professions: profession(where: {
      periods: {
        start: { _eq: $start }
        end: { _eq: $end }
        hospital_id: { _eq: $hospitalId }
      }
    }) {
      uid
      name
      dangerous
      description
      profession_requests(where: {
        volunteer_id: { _eq: $userId }
      }) {
        uid
      }
      requirements: hospital_profession_requirements(where: {
        hospital_id: { _eq: $hospitalId }
      }) {
        uid
        satisfied(where: {
          volunteer_id: { _eq: $userId }
        }) {
          uid
        }
        requirement {
          uid
          name
        }
      }
    }
  }
`

export const periodDemandsByHospital = gql`
query periodDemandsByHospital(
  $start: timetz!
  $end: timetz!
  $hospitalId: uuid!
) {
  period_demand (where: {
    period: {
      start: { _eq: $start }
      end: { _eq: $end }
      hospital_id: { _eq: $hospitalId }
    }
  }) {
    uid
    notabene
    profession {
      uid
      name
      dangerous
      description
      requirements
    }
  }
}
`

export const submitPhone = gql`
  mutation submitPhone($phone: String) {
    signUp(phone: $phone) {
      status
    }
  }
`

export const login = gql`
  mutation login($phone: String $password: String) {
    getToken(phone: $phone password: $password) {
      authenticated
      accessToken
      expires
    }
  }
`

export const addShift = gql`
mutation addShift($shift: period_insert_input!) {
  insert_period(
    objects: [$shift]
    on_conflict: {
      constraint: period_start_end_hospital_id_profession_id_key
      update_columns: [demand]
    }
  ) {
    returning {
      hospital {
        uid
        periods {
          uid
          start
          end
          demand
          notabene
          profession_id
          profession {
            uid
            name
          }
        }
      }
    }
  }
}`

export const editShift = gql`
mutation addShift($uid: uuid! $data: period_set_input) {
  update_period(_set: $data where: { uid: { _eq: $uid } }) {
    returning {
      hospital {
        uid
        periods {
          uid
          start
          end
          demand
          notabene
          profession {
            uid
            name
          }
        }
      }
    }
  }
}`

export const removeShift = gql`
mutation removeShift($uid: uuid!) {
  delete_period (where: { uid: { _eq:  $uid } }) {
    returning {
      hospital {
        uid
        periods {
          uid
          start
          end
          demand
          profession {
            uid
          }
        }
      }
    }
  }
}`

export const updatePeriodDemand = gql`
mutation updatePeriodDemand($uid: uuid! $periodDemands: [period_demand_insert_input!]!) {
  delete_period_demand(where: { period_id: { _eq: $uid }}) {
    affected_rows
  }
  insert_period_demand(objects: $periodDemands) {
    affected_rows
    returning {
      uid
      demand
      profession {
        uid
        name
      }
    }
  }
}
`

export const confirm = gql`
mutation confirmVolunteer($uid: uuid! $confirmed: Boolean) {
  update_volunteer_shift(_set: { confirmed: $confirmed } where: { uid: { _eq: $uid } }) {
    affected_rows
  }
}`

export const removeVolunteerShift = gql`
mutation removeVolunteerShift($uid: uuid!) {
  delete_volunteer_shift(where: { uid: { _eq: $uid }}) {
    affected_rows
  }
}`

export const addToBlackList = gql`
mutation addToBlackList($uid: uuid! $comment: String) {
  insert_blacklist(objects: [{ volunteer_id: $uid comment: $comment }]) {
    returning {
      uid
    }
  }
}`

export const updateDirections = gql`
mutation updateDirections($hospitalId: uuid! $directions: String!) {
  update_hospital(where: { uid: { _eq: $hospitalId } } _set: { directions: $directions }) {
    returning {
      uid
      directions
    }
  }
}`

export const refreshToken = `
 mutation {
   refreshToken {
     accessToken
     expires
   }
 }` 