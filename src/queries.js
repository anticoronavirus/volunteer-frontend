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
subscription Shifts($from: date $to: date $profession: String ) {
  shifts(
    order_by: { date: asc, start: asc }
    where: { date: { _gte: $from  _lt: $to } }) {
    uid
    date
    start
    end
    professions {
      name
      number
    }
    volunteers (where: { profession: { _eq: $profession }}) {
      uid
      fname
      mname
      lname
      phone
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
    }
  }
`