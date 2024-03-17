import chroma from 'chroma-js'

export const reactSelectSmallStyles = {
  control: (provided: any) => ({
    ...provided,
    minHeight: '30px',
    height: '30px',
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    height: '30px',
    padding: '0 6px',
    fontSize: '0.75rem',
  }),
  input: (provided: any) => ({
    ...provided,
    margin: '0px',
    fontSize: '0.75rem',
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
    height: '30px',
  }),
  option: (provided: any) => ({
    ...provided,
    fontSize: '14px',
    padding: '10px 10px',
  }),
}

export const reactSelectColorStyles = {
  control: (provided: any, { selectProps }: any) => {
    const color = selectProps.value && selectProps.value.color ? selectProps.value.color : '#fff'

    return {
      ...provided,
      minHeight: '30px',
      height: '30px',
      backgroundColor: color,
    }
  },
  option: (provided: any, { data, isDisabled, isFocused, isSelected }: any) => {
    const color = chroma(data.color)
    return {
      ...provided,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? data.color
        : isFocused
        ? color.darken().css()
        : data.color,
      color: isDisabled ? '#ccc' : chroma.contrast(color, 'white') > 2 ? 'white' : 'black',
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...provided[':active'],
        backgroundColor: !isDisabled
          ? isSelected
            ? data.color
            : color.alpha(0.7).css()
          : undefined,
      },
      fontSize: '0.75rem',
    }
  },
  valueContainer: (provided: any) => ({
    ...provided,
    height: '30px',
    padding: '0 6px',
    fontSize: '0.75rem',
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
    height: '30px',
  }),
}
