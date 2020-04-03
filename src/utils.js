import format from 'date-fns/format'
import ru from 'date-fns/locale/ru'
import map from 'lodash/fp/map'

export const formatDate = date => format(new Date(date), 'd MMMM', { locale: ru })

export const formatLabel = (type, count) =>
  count + ' ' +
  labels[type].get(
    count < 21 && count > 5
      ? 5
      : count%10 === 1
          ? 1
          : count%10 < 5
            ? 4
            : 5)

const labels = {
  hospital: new Map([
    [1, 'больница'],
    [4, 'больницы'],
    [5, 'больниц']
  ]),
  place: new Map([
    [1, 'место'],
    [4, 'места'],
    [5, 'мест'],
  ]),
  volunteer: new Map([
    [1, 'волонтёр'],
    [4, 'волонтёра'],
    [5, 'волонтёров'],
  ]),
}

export const uncappedMap =  map.convert({ 'cap': false })
