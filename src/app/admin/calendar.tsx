'use client';

import { useState } from "react";
import styles from "./page.module.css";

export function Calendar({ orderDates, ordersByDate }: { orderDates: Record<string, number>, ordersByDate: Record<string, any[]> }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay();
  
  const days = [];
  for (let i = 0; i < (startDay === 0 ? 6 : startDay - 1); i++) {
    days.push(null);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const orderCount = orderDates[dateStr] || 0;
    const isToday = day === today.getDate();
    
    days.push({ day, orderCount, isToday, date: dateStr });
  }

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
  const selectedOrders = selectedDate ? ordersByDate[selectedDate] : [];

  return (
    <div>
      <div className={styles.calendarGrid}>
        {weekDays.map(day => (
          <div key={day} className={styles.calendarWeekDay}>{day}</div>
        ))}
        {days.map((day, index) => (
          <div 
            key={index} 
            className={`${styles.calendarDay} ${day?.isToday ? styles.calendarDayToday : ''} ${day?.orderCount ? styles.calendarDayHasOrders : ''} ${day?.date === selectedDate ? styles.calendarDaySelected : ''}`}
            onClick={() => day?.orderCount && setSelectedDate(day.date === selectedDate ? null : day.date)}
          >
            {day && (
              <>
                <span>{day.day}</span>
                {day.orderCount > 0 && (
                  <span className={styles.calendarDayBadge}>{day.orderCount}</span>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {selectedDate && selectedOrders && (
        <div className={styles.calendarDetails}>
          <div className={styles.calendarDetailsTitle}>Замовлення на {selectedDate}:</div>
          {selectedOrders.map((order: any, index: number) => (
            <div key={order.orderNumber || index} className={styles.calendarOrderItem}>
              <div className={styles.calendarOrderNumber}>#{order.orderNumber}</div>
              <div className={styles.calendarOrderItems}>
                {order.items.map((item: any, i: number) => (
                  <span key={i}>{item.name_ua}{i < order.items.length - 1 ? ', ' : ''}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
