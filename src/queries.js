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
    periods {
      uid
      start
      end
      demand
    }
  }
  me {
    managedHospital {
      uid
    }
  }
}`

export const professions = gql`
{
  professions: profession {
    name
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
  $hospitalId: uuid
  $date: date
  $start: timetz
  $end: timetz
) {
  insert_volunteer_shift(objects: [{
    volunteer_id: $userId
    hospital_id: $hospitalId
    date: $date
    start: $start
    end: $end
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

export const shifts = gql`
query shifts($hospitalId: uuid $userId: uuid) {
  shifts: shift_selector(args: { _hospital_id: $hospitalId }) {
    ...shift
  }
}
${shiftFragment}`

export const shiftsSubscription = gql`
subscription shiftsSubscription($hospitalId: uuid $userId: uuid) {
  shifts: shift_selector(args: { _hospital_id: $hospitalId }) {
    ...shift
  }
}
${shiftFragment}`

export const hospitalShifts = gql`
query shifts($hospitalId: uuid) {
  shifts: shift_selector(args: { _hospital_id: $hospitalId }) {
    date
    start
    end
    placesavailable
    demand
    shiftRequests(where: { hospital_id: { _eq: $hospitalId }}) {
      uid
      confirmed
      hospital { uid }
      volunteer {
        uid
        lname
        fname
        phone
        profession
        provisioned_documents(where: { hospital_id: { _eq: $hospitalId }}) {
          uid
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

export const filteredHospitals = gql`
query filteredHospitals (
  $start: timetz,
  $end: timetz
) {
  hospitals: hospital(where: { periods: { 
    start: { _eq: $start }
    end: { _eq: $end }
  } }) {
    uid
    shortname
    address
    periods { demand }
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
mutation addShift($uid: uuid! $start: timetz! $end: timetz! $demand: Int ) {
  insert_period(objects: [{hospital_id: $uid start: $start end: $end demand: $demand}]) {
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

export const refreshToken = `
 mutation {
   refreshToken {
     accessToken
     expires
   }
 }` 