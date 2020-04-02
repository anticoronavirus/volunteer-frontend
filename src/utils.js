import format from 'date-fns/format'
import ru from 'date-fns/locale/ru'

export const formatDate = date => format(new Date(date), 'd MMMM', { locale: ru })

export const formatLabel = (type, count) =>
  count + ' ' +
  labels[type].get(
    count === 1
      ? 1
      : count < 20 && count > 5
        ? 5
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