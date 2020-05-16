import { createElement as $, useRef, useLayoutEffect, useEffect, memo } from 'react'
import map from 'lodash/fp/map'
import range from 'lodash/fp/range'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

const SelectTime = ({
  value,
  onChange,
  timeRange,
  dependsOn,
  placeholder
}) => {
  const ref = useScrollTo(value, dependsOn)

  return $(Box, null,
    $(Typography, { variant: 'caption' }, placeholder),
    $(Box, { overflow: 'scroll', display: 'flex', position: 'relative', ref, marginTop: 1 },
      $(ToggleButtonGroup, {
        size: 'small',
        exclusive: true,
        value,
        onChange: (_, value) => onChange(value)
      },
        map(RangeButton, range(...timeRange)))))
}

SelectTime.defaultProps = {
  timeRange: [],
  onChange: () => {}
}

const useScrollTo = (value, dependsOn) => {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const child = value && ref.current && ref.current.querySelector(`button[value="${value}"]`)
    child && ref.current.scrollTo({
      top: 0,
      left: child.offsetLeft,
      behavior: 'smooth'
    })
  }, [value, dependsOn])
  return ref
}

const RangeButton = value =>
  $(ToggleButton, {
    key: value,
    value: value < 24 ? value : value - 24 },
    `${value < 24 ? value : value - 24}:00`)

export default memo(SelectTime)
