import gql from 'graphql-tag'

export const me = gql`{
  me {
    uid
    fname
    lname
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

export const addVolunteer = gql`
mutation UpsertVolunteer(
  $fname: String
  $mname: String
  $lname: String
  $email: String
  $profession: String
  $phone: String
) {
  insert_volunteer(
    objects: [{
      fname: $fname
      mname: $mname
      lname: $lname
      email: $email
      phone: $phone
      profession: $profession
    }]
    on_conflict: {
      constraint: volunteer_phone_email_key
      update_columns: [
        fname
        mname
        lname
        profession
      ]
    }) {
    returning {
      uid
      shifts {
        uid
      }
    }
  }
}
`

export const addVolunteerToShift = gql`
mutation AddVolunteerToShift(
  $volunteer_id: uuid
  $shift_id: uuid
) {
  insert_volunteer_shift(objects: [{
    volunteer_id: $volunteer_id
    shift_id: $shift_id
  }]) {
    returning {
      shift {
        uid
        volunteers {
          uid
        }
      }
    }
  }
}
`

export const removeVolunteerFromShift = gql`
mutation AddVolunteerToShift(
  $volunteer_id: uuid
  $shift_id: uuid
) {
  delete_volunteer_shift(where: {
    volunteer_id: { _eq: $volunteer_id }
    shift_id: { _eq: $shift_id }
  }) {
    returning {
      shift {
        uid
        volunteers {
          uid
        }
      }
    }
  }
}
`

export const volunteerShifts = gql`
subscription VolunteerShifts($from: date $to: date) {
  volunteer_shift(
    order_by: { shift: { date: asc } volunteer: { uid: asc } }
    where: { shift: { date: { _gte: $from  _lt: $to }}}) {
    confirmed
    shift {
      uid
      date
      start
      end
    }
    volunteer {
      uid
      fname
      mname
      lname
      phone
      email
      profession
    }
  }
}`

export const shifts = gql`
subscription {
  shifts(order_by: { meh: asc start: asc }) {
    date: meh
    start
    end
    demand
    shiftRequests {
      uid
      confirmed
      volunteer {
        uid
        lname
        fname
      }
    }
  }
}
`

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
query hint ($name: bpchar!) {
  me { uid }
  hint_by_pk(name: $name) {
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
mutation confirmVolunteer($uid: uuid!) {
  update_volunteer_shift(where: { uid: { _eq: $uid } }) {
    uid
    confirmed
  }
}`

export const removeVolunteerShift = gql`
mutation removeVolunteerShift($uid: uuid!) {
  delete_volunteer_shift(where: { uid: { _eq: $uid }}) {
    affected_rows
  }
}`

export const addToBlackList = gql`
mutation addToBlackList($uid: uuid!) {
  update_volunteer(_set: { blacklisted: true } where: { uid: { _eq: $uid }}) {
    returning {
      uid
      blacklisted    
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