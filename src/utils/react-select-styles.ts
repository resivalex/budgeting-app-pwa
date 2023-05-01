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
    fontSize: '0.75rem',
  }),
}
