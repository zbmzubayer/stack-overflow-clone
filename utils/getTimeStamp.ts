import { time } from 'console';

export default function getTimeStamp(date: Date) {
  const now = new Date();
  const timeDifference = now.getTime() - date.getTime();
  const seconds = Math.floor(timeDifference / 1000);

  // define time intervals in milliseconds
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;
  let timeStamp = '';

  if (timeDifference < minute) {
    timeStamp = `${seconds} second${seconds > 1 ? 's' : ''}`;
  } else if (timeDifference < hour) {
    timeStamp = `${Math.floor(seconds / 60)} minute${Math.floor(seconds / 60) > 1 ? 's' : ''}`;
  } else if (timeDifference < day) {
    timeStamp = `${Math.floor(seconds / 60 / 60)} hour${
      Math.floor(seconds / 60 / 60) > 1 ? 's' : ''
    }`;
  } else if (timeDifference < week) {
    timeStamp = `${Math.floor(seconds / 60 / 60 / 24)} day${
      Math.floor(seconds / 60 / 60 / 24) > 1 ? 's' : ''
    }`;
  } else if (timeDifference < month) {
    timeStamp = `${Math.floor(seconds / 60 / 60 / 24 / 7)} week${
      Math.floor(seconds / 60 / 60 / 24 / 7) > 1 ? 's' : ''
    }`;
  } else {
    timeStamp = `${Math.floor(seconds / 60 / 60 / 24 / 30)} month${
      Math.floor(seconds / 60 / 60 / 24 / 30) > 1 ? 's' : ''
    }`;
  }
  return timeStamp;
}
