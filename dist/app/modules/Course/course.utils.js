"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDurationInWeeks = void 0;
const calculateDurationInWeeks = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInMs = end.getTime() - start.getTime();
    const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000;
    const durationInWeeks = Math.ceil(differenceInMs / millisecondsInWeek);
    return durationInWeeks;
};
exports.calculateDurationInWeeks = calculateDurationInWeeks;
