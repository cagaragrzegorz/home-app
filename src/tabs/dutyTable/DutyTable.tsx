import React from 'react';
import './DutyTable.css';

type Kid = 'Tosia' | 'Mania' | 'Ola';
type Weekday = 'Poniedziałek' | 'Wtorek' | 'Środa' | 'Czwartek' | 'Piątek'| 'Sobota' | 'Niedziela';

type Duty = {
    [key in Kid]: string[];
};

type DutiesByDay = {
    [day in Weekday]: Duty;
}

const duties: DutiesByDay = {
  Poniedziałek: {
    Tosia: ['Wash dishes', 'Fold laundry'],
    Mania: ['Take out trash'],
    Ola: ['Feed the dog', 'Clean room'],
  },
  Wtorek: {
    Tosia: ['Vacuum'],
    Mania: ['Clean bathroom', 'Water plants'],
    Ola: ['Help with homework'],
  },
  Środa: {
    Tosia: ['Do laundry'],
    Mania: ['Sweep floor'],
    Ola: ['Help with cooking', 'Organize toys'],
  },
  Czwartek: {
    Tosia: ['Dust shelves'],
    Mania: ['Take out trash'],
    Ola: ['Feed the dog'],
  },
  Piątek: {
    Tosia: ['Clean windows'],
    Mania: ['Mop floor'],
    Ola: ['Organize toys'],
  },
  Sobota: {
    Tosia: ['Help with groceries'],
    Mania: ['Wash car'],
    Ola: ['Clean pet area'],
  },
  Niedziela: {
    Tosia: ['Prepare school bags'],
    Mania: ['Tidy bedroom'],
    Ola: ['Help with lunch'],
  },
};

const kids: Kid[] = ['Tosia', 'Mania', 'Ola'];
const weekdays: Weekday[] = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
function getCurrentWeekday(): Weekday {
  const dayIndex = new Date().getDay();
  return weekdays[(dayIndex + 6) % 7];
}

export const DutyTable: React.FC = () => {
  const today: Weekday = getCurrentWeekday();

  return (
    <div>
      <table style={{
        borderCollapse: 'separate',
        width: '100%',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        backgroundColor: '#ccc',
        fontSize: '1.1rem'
      }}
      >
        <thead>
          <tr style={{ backgroundColor: '#adadad' }}>
            <th style={{ border: '2px solid #ccc', padding: '10px' }}>Dzień tygodnia</th>
            {kids.map((kid) => (
              <th key={kid} style={{ border: '1px solid #ccc', padding: '5px' }}>{kid}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weekdays.map((day) => {
            const isToday = day === today;
            return (
              <tr key={day} style={{ backgroundColor: isToday ? '#aebfdb' : '#e0e0e0' }}>
                <td style={{ border: '1px solid #ccc', padding: '8px', fontWeight: isToday ? 'bold' : 'normal' }}>{day}</td>
                {kids.map((kid) => (
                  <td key={kid} style={{ border: '1px solid #ccc', padding: '8px', fontWeight: isToday ? 'bold' : 'normal' }}>
                    <ul style={{ margin: 0, paddingLeft: '0px', listStylePosition: 'inside' /*, listStyleType: 'none'*/}}>
                      {duties[day][kid].map((duty, index) => (
                        <li key={index}>{duty}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
