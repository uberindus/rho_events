import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru)

export const DatePickerField = ({ name, value, onChange }) => {
    return (
        <DatePicker
            dateFormat="dd MMMM yyyy"
            wrapperClassName="datePicker"
            selected={(value && new Date(value)) || null}
            onChange={val => {
                onChange(name, val);
            }}
            locale='ru'
        />
    );
  };