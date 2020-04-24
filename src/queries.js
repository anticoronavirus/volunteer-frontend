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
    periods {
      uid
      start
      end
      period_demands {
        uid
        demand
        profession {
          name
        }
      }
    }
  }
  me {
    uid
    phone
    managedHospitals (where: { hospital: { uid: { _eq: $uid }}}) {
      coophone
    }
  }
}`

export const professions = gql`
{
  professions: profession {
    uid
    name
    description
    requirements
    dangerous
  }
}`

export const updateVolunteer = gql`
mutation UpsertVolunteer(
  $uid: uuid
  $fname: String
  $mname: String
  $lname: String
  $email: String
  $comment: String
  $profession: String
) {
  update_volunteer(
    _set: {
      fname: $fname
      mname: $mname
      lname: $lname
      email: $email
      comment: $comment
      profession: $profession
    }
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

export const exportShifts = gql`{
  volunteer_shift {
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

export const addVolunteerToShift = gql`  
mutation addVolunteerToShift(
  $userId: uuid
  $period_demand_id: uuid
  $date: date
  $start: timetz
  $end: timetz
) {
  insert_volunteer_shift(objects: [{
    volunteer_id: $userId
    period_demand_id: $period_demand_id
    date: $date
    start: $start
    end: $end
  }]) {
    returning {
      uid
      confirmed
      period_demand {
        period {
          hospital {
            uid
            shortname
          }
        }
      }
    }
  }
}
`

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
    period_demand {
      period {
        hospital {
          uid
          shortname
        }
      }
    }
  }
}
`

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

export const hospitalShifts = gql`
subscription shifts($hospitalId: uuid) {
  shifts: shift_selector(args: { _hospital_id: $hospitalId }) {
    date
    start
    end
    placesavailable
    demand
    shiftRequests(where: { hospital_id: { _eq: $hospitalId }}) {
      uid
      date
      start
      end
      hospital_id
      period_demand {
        profession {
          name
        }
      }
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
  }
}
`

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

export const filteredShiftData = gql`
query filteredHospitals(
  $start: timetz
  $end: timetz
  $hospitalId: uuid
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
  period_demand (where: {
    demand: { _gte: 0 }
    period: {
      hospital_id: { _eq: $hospitalId }
      start: { _eq: $start }
      end: { _eq: $end }
    }
  }) {
    uid
    profession {
      uid
      name
      dangerous
      description
      requirements
    }
  }
}`

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
  insert_period(objects: [$shift]) {
    returning {
      hospital {
        uid
        periods {
          uid
          start
          end
          period_demands {
            uid
            demand
            profession {
              name
            }
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
        }
      }
    }
  }
}`

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
mutation updateDirections($uid: uuid! $directions: String!) {
  update_hospital(where: { uid: { _eq: $uid } } _set: { directions: $directions }) {
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