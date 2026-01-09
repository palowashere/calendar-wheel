import * as datefns from "date-fns";
import React, { useState } from "react";
import { CalendarEvent, Category } from "../types";
import {
  DEFAULT_FRACTION_DIGITS,
  generateArcPathCommand,
  generateFatArcPathCommand,
} from "../utils/svg";
import { WheelStyleConfig } from "../wheelStyle";
import { Palette } from "../palettes/types";

function* generateDays(minDate: Date, maxDate: Date) {
  let current = new Date(minDate);
  while (current <= maxDate) {
    yield current;
    current = datefns.addDays(current, 1);
  }
}

function* generateMonthTuples(minDate: Date, maxDate: Date) {
  let current = new Date(minDate);
  while (current <= maxDate) {
    const firstDayOfMonth = datefns.startOfMonth(current);
    const lastDayOfMonth = datefns.endOfMonth(current);
    yield [
      datefns.max([minDate, firstDayOfMonth]),
      datefns.min([maxDate, lastDayOfMonth]),
    ] as const;
    current = datefns.addMonths(current, 1);
  }
}

function* generateWeekTuples(
  minDate: Date,
  maxDate: Date,
  iso: boolean,
  locale: datefns.Locale,
) {
  let current = new Date(minDate);
  while (current <= maxDate) {
    const firstDayOfWeek = iso
      ? datefns.startOfISOWeek(current)
      : datefns.startOfWeek(current, { locale });
    const lastDayOfWeek = iso
      ? datefns.endOfISOWeek(current)
      : datefns.endOfWeek(current, { locale });
    yield [
      datefns.max([minDate, firstDayOfWeek]),
      datefns.min([maxDate, lastDayOfWeek]),
    ] as const;
    current = datefns.addDays(lastDayOfWeek, 1);
  }
}

interface WheelRenderEphemeraInput {
  minDate: Date;
  maxDate: Date;
  dateLocale: datefns.Locale;
  styleConfig: WheelStyleConfig;
  palette: Palette;
}

interface WheelRenderEphemeraInternal extends WheelRenderEphemeraInput {
  dateToAngle: (date: Date) => number;
}

interface WheelProps extends WheelRenderEphemeraInput {
  events: readonly CalendarEvent[];
  categories: readonly Category[];
}

function getMonthRingElements({
  minDate,
  maxDate,
  dateLocale,
  styleConfig,
  dateToAngle,
}: WheelRenderEphemeraInternal) {
  const {
    monthInnerRadius,
    monthOuterRadius,
    weekOuterRadius,
    reverse,
    monthFontSize,
  } = styleConfig;
  
  // Seasonal colors for months
  const getSeasonColor = (date: Date) => {
    const month = date.getMonth();
    // Winter: Dec(11), Jan(0), Feb(1) - Light blue
    // Spring: Mar(2), Apr(3), May(4) - Light green
    // Summer: Jun(5), Jul(6), Aug(7) - Light yellow (made slightly more saturated)
    // Fall: Sep(8), Oct(9), Nov(10) - Light peach
    if ([11, 0, 1].includes(month)) return "rgba(173, 216, 230, 0.6)";
    if ([2, 3, 4].includes(month)) return "rgba(144, 238, 144, 0.6)";
    if ([5, 6, 7].includes(month)) return "rgba(255, 255, 200, 0.7)"; // Slightly more saturated and opaque
    if ([8, 9, 10].includes(month)) return "rgba(255, 218, 185, 0.6)";
    return "rgba(200, 200, 200, 0.6)";
  };
  
  if (monthInnerRadius >= monthOuterRadius) return null;
  return Array.from(generateMonthTuples(minDate, maxDate)).map(
    ([date1, date2]) => {
      const textPathId = `month-${+date1}`;
      const startAngle = dateToAngle(date1);
      const endAngle = dateToAngle(date2);
      const [textStartAngle, textEndAngle] = reverse
        ? [endAngle, startAngle]
        : [startAngle, endAngle];
      return (
        <React.Fragment key={+date1}>
          <path
            d={generateFatArcPathCommand(
              0,
              0,
              monthInnerRadius,
              monthOuterRadius,
              startAngle,
              endAngle,
              reverse,
            )}
            fill={getSeasonColor(date1)}
          />
          {monthFontSize > 0 ? (
            <>
              <path
                id={textPathId}
                fill="none"
                d={generateArcPathCommand(
                  0,
                  0,
                  Math.max(weekOuterRadius, monthOuterRadius) + 5,
                  textStartAngle,
                  textEndAngle,
                )}
              />
              <text>
                <textPath
                  fontSize={monthFontSize}
                  href={`#${textPathId}`}
                  textAnchor={reverse ? "end" : "start"}
                  startOffset={reverse ? "100%" : "0%"}
                >
                  {datefns.formatDate(date1, "LLLL", {
                    locale: dateLocale,
                  })}
                </textPath>
              </text>
            </>
          ) : null}
        </React.Fragment>
      );
    },
  );
}

function getWeekRingElements({
  minDate,
  maxDate,
  dateLocale,
  styleConfig,
  dateToAngle,
}: WheelRenderEphemeraInternal) {
  const { weekInnerRadius, weekOuterRadius, reverse, weekFontSize, isoWeeks } =
    styleConfig;
  if (weekInnerRadius >= weekOuterRadius) return null;
  return Array.from(
    generateWeekTuples(minDate, maxDate, isoWeeks, dateLocale),
  ).map(([date1, date2]) => {
    const textPathId = `week-${+date1}`;
    const startAngle = dateToAngle(date1);
    const endAngle = dateToAngle(date2);
    const [textStartAngle, textEndAngle] = reverse
      ? [endAngle, startAngle]
      : [startAngle, endAngle];
    return (
      <React.Fragment key={+date1}>
        <path
          d={generateFatArcPathCommand(
            0,
            0,
            weekInnerRadius,
            weekOuterRadius,
            startAngle,
            endAngle,
            reverse,
          )}
          stroke="#333"
          fill="none"
          opacity={0.7}
        />
        {weekFontSize > 0 ? (
          <>
            <path
              id={textPathId}
              fill="none"
              d={generateArcPathCommand(
                0,
                0,
                (weekOuterRadius + weekInnerRadius) / 2,
                textStartAngle,
                textEndAngle,
              )}
            />
            <text>
              <textPath
                fontSize={weekFontSize}
                href={`#${textPathId}`}
                textAnchor="middle"
                dominantBaseline="middle"
                startOffset="50%"
              >
                {datefns.formatDate(date1, isoWeeks ? "II" : "ww", {
                  locale: dateLocale,
                })}
              </textPath>
            </text>
          </>
        ) : null}
      </React.Fragment>
    );
  });
}

function getDateRingElements({
  minDate,
  maxDate,
  styleConfig,
  dateToAngle,
}: WheelRenderEphemeraInternal) {
  const { dateInnerRadius, dateOuterRadius } = styleConfig;
  if (dateInnerRadius >= dateOuterRadius) return null;
  const today = new Date();
  const todayStart = datefns.startOfDay(today);
  
  return Array.from(generateDays(minDate, maxDate)).map((date) => {
    const angle = dateToAngle(date);
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    const x1 = cosAngle * dateInnerRadius;
    const y1 = sinAngle * dateInnerRadius;
    const x2 = cosAngle * dateOuterRadius;
    const y2 = sinAngle * dateOuterRadius;
    
    const dateStart = datefns.startOfDay(date);
    const weekday = datefns.getISODay(date);
    const month = date.getMonth();
    const isSummer = [5, 6, 7].includes(month); // June, July, August
    
    let stroke = isSummer ? "#cccccc" : "white"; // Darker grey for summer
    let strokeWidth = 1;
    let opacity = 0.5;
    
    // Today: bright pink
    if (dateStart.getTime() === todayStart.getTime()) {
      stroke = "#ff69b4"; // Hot pink
      strokeWidth = 2;
      opacity = 1;
    }
    // Sundays: blue (or darker blue in summer)
    else if (weekday === 7) {
      stroke = isSummer ? "#000080" : "blue"; // Darker blue for summer
    }
    
    return (
      <line
        key={+date}
        x1={x1.toFixed(DEFAULT_FRACTION_DIGITS)}
        y1={y1.toFixed(DEFAULT_FRACTION_DIGITS)}
        x2={x2.toFixed(DEFAULT_FRACTION_DIGITS)}
        y2={y2.toFixed(DEFAULT_FRACTION_DIGITS)}
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
    );
  });
}

function getEventsElements(
  events: readonly CalendarEvent[],
  categories: readonly Category[],
  { styleConfig, dateToAngle }: WheelRenderEphemeraInternal,
  setHoveredEvent: (event: CalendarEvent | null) => void,
) {
  const {
    eventFontSize,
    eventInnerRadius,
    laneGap,
    laneWidth,
    minimumVisibleAngleDeg,
    reverse,
  } = styleConfig;
  const minimumVisibleAngle = (minimumVisibleAngleDeg / 360) * Math.PI * 2;
  return events.map((event) => {
    // TODO: time zones not supported
    const textPathId = `textPath-${event.uid}`;
    const startAngle = dateToAngle(event.start);
    let endAngle = dateToAngle(event.end);
    
    // Ensure minimum visibility for short events (at least 1 degree or 1 day, whichever is larger)
    const minAngleSpan = Math.max(minimumVisibleAngle, (1 / 360) * Math.PI * 2); // At least 1 degree
    if (Math.abs(endAngle - startAngle) < minAngleSpan) {
      // Extend the end angle to make it visible
      endAngle = startAngle + (reverse ? -minAngleSpan : minAngleSpan);
    }
    
    const [textStartAngle, textEndAngle] = reverse
      ? [endAngle, startAngle]
      : [startAngle, endAngle];
    const isLarge = Math.abs(endAngle - startAngle) > Math.PI;
    const normLane = event.lane - 1;
    const laneInnerRadius = eventInnerRadius - normLane * (laneWidth + laneGap);
    const laneOuterRadius = laneInnerRadius + laneWidth;
    const category = categories.find((cat) => cat.id === event.categoryId);
    const fillColor = category?.color || "#f5f6fa";
    const fontColor = category?.fontColor || "#000000";
    return (
      <React.Fragment key={event.uid}>
        <path
          d={generateFatArcPathCommand(
            0,
            0,
            laneInnerRadius,
            laneOuterRadius,
            startAngle,
            endAngle,
            reverse,
            isLarge,
          )}
          fill={fillColor}
          stroke="#2f3640"
          strokeWidth={0.5}
          onMouseEnter={() => setHoveredEvent(event)}
          onMouseLeave={() => setHoveredEvent(null)}
        />
        {eventFontSize > 0 ? (
          <>
            <path
              id={textPathId}
              fill="none"
              d={generateArcPathCommand(
                0,
                0,
                (laneInnerRadius + laneOuterRadius) / 2,
                textStartAngle,
                textEndAngle,
                false,
                isLarge,
              )}
            />
            <text
              fontSize={eventFontSize}
              dominantBaseline="middle"
              textAnchor="middle"
              fill={fontColor}
              onMouseEnter={() => setHoveredEvent(event)}
              onMouseLeave={() => setHoveredEvent(null)}
            >
              <textPath href={`#${textPathId}`} startOffset="50%">
                {event.subject}
              </textPath>
            </text>
          </>
        ) : null}
      </React.Fragment>
    );
  });
}

function getTodayIndicatorElements({
  dateToAngle,
  styleConfig,
}: WheelRenderEphemeraInternal) {
  const { dateInnerRadius, dateOuterRadius } = styleConfig;
  if (dateInnerRadius >= dateOuterRadius) return null;
  const angle = dateToAngle(new Date());
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);
  const x1 = cosAngle * dateInnerRadius;
  const y1 = sinAngle * dateInnerRadius;
  const x2 = cosAngle * dateOuterRadius;
  const y2 = sinAngle * dateOuterRadius;
  return (
    <line
      x1={x1.toFixed(DEFAULT_FRACTION_DIGITS)}
      y1={y1.toFixed(DEFAULT_FRACTION_DIGITS)}
      x2={x2.toFixed(DEFAULT_FRACTION_DIGITS)}
      y2={y2.toFixed(DEFAULT_FRACTION_DIGITS)}
      stroke="#ff1493" // Deep pink
      strokeWidth={3}
      opacity={0.8}
    />
  );
}

function getHoveredEventDisplay(hoveredEvent: CalendarEvent | null, categories: readonly Category[]) {
  if (!hoveredEvent) return null;
  const category = categories.find((cat) => cat.id === hoveredEvent.categoryId);
  const lines = [
    `Subject: ${hoveredEvent.subject}`,
    `Start: ${datefns.format(hoveredEvent.start, 'yyyy-MM-dd')}`,
    `End: ${datefns.format(hoveredEvent.end, 'yyyy-MM-dd')}`,
    `Lane: ${hoveredEvent.lane}`,
    `Category: ${category?.name || 'Unknown'}`,
  ];
  return (
    <g>
      <rect x="-120" y="-70" width="240" height="140" fill="white" stroke="black" opacity={0.9} />
      {lines.map((line, i) => (
        <text key={i} x="0" y={-50 + i * 20} textAnchor="middle" fontSize="14" fill="black">
          {line}
        </text>
      ))}
    </g>
  );
}

function getSeasonalBackgroundRings(
  eph: WheelRenderEphemeraInternal,
) {
  const { minDate, maxDate, dateToAngle, styleConfig } = eph;
  const outerRadius = Math.max(
    styleConfig.weekOuterRadius,
    styleConfig.dateOuterRadius,
    styleConfig.eventInnerRadius,
    styleConfig.monthOuterRadius,
  );
  
  // Seasonal colors: Winter, Spring, Summer, Fall
  const seasonalColors = [
    { name: "Winter", color: "#add8e6", months: [11, 0, 1] }, // Dec, Jan, Feb
    { name: "Spring", color: "#90ee90", months: [2, 3, 4] },   // Mar, Apr, May
    { name: "Summer", color: "#ffffe0", months: [5, 6, 7] },   // Jun, Jul, Aug
    { name: "Fall", color: "#ffdab9", months: [8, 9, 10] },    // Sep, Oct, Nov
  ];

  const rings: React.ReactNode[] = [];

  seasonalColors.forEach((season) => {
    season.months.forEach((monthNum) => {
      // Create start and end dates for each month
      let monthStart = new Date(minDate.getFullYear(), monthNum, 1);
      let monthEnd = datefns.endOfMonth(monthStart);

      // Clamp to the wheel's date range
      if (monthEnd < minDate || monthStart > maxDate) return;
      
      monthStart = datefns.max([minDate, monthStart]);
      monthEnd = datefns.min([maxDate, monthEnd]);

      const startAngle = dateToAngle(monthStart);
      const endAngle = dateToAngle(monthEnd);
      const isLarge = Math.abs(endAngle - startAngle) > Math.PI;

      rings.push(
        <path
          key={`season-${season.name}-${monthNum}`}
          d={generateFatArcPathCommand(
            0,
            0,
            0,
            outerRadius,
            startAngle,
            endAngle,
            styleConfig.reverse,
            isLarge,
          )}
          fill={season.color}
          opacity={0.08}
          pointerEvents="none"
        />
      );
    });
  });

  return rings;
}

function getPeriodDateRing(
  eph: WheelRenderEphemeraInternal,
  color: string,
  opacity: number,
  startDate: Date,
  endDate: Date,
) {
  const { styleConfig, dateToAngle } = eph;
  const innerRadius = Math.min(
    styleConfig.weekInnerRadius,
    styleConfig.dateInnerRadius,
    styleConfig.eventInnerRadius,
    styleConfig.monthInnerRadius,
  );
  const outerRadius = Math.max(
    styleConfig.weekOuterRadius,
    styleConfig.dateOuterRadius,
    styleConfig.eventInnerRadius,
    styleConfig.monthOuterRadius,
  );
  const startAngle = dateToAngle(startDate);
  const endAngle = dateToAngle(endDate);
  const isLarge = Math.abs(endAngle - startAngle) > Math.PI;
  return (
    <path
      d={generateFatArcPathCommand(
        0,
        0,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        styleConfig.reverse,
        isLarge,
      )}
      fill={color}
      opacity={opacity}
    />
  );
}

function getPastDaysPieChart(
  eph: WheelRenderEphemeraInternal,
  color: string,
  opacity: number,
  startDate: Date,
  endDate: Date,
) {
  const { styleConfig, dateToAngle } = eph;
  const innerRadius = 0; // From center
  const outerRadius = styleConfig.dateInnerRadius; // To inner edge of date ring
  const startAngle = dateToAngle(startDate);
  const endAngle = dateToAngle(endDate);
  const isLarge = Math.abs(endAngle - startAngle) > Math.PI;
  return (
    <path
      d={generateFatArcPathCommand(
        0,
        0,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        styleConfig.reverse,
        isLarge,
      )}
      fill={color}
      opacity={opacity}
    />
  );
}

export function Wheel({
  events,
  minDate,
  maxDate,
  dateLocale,
  styleConfig,
  palette,
  categories,
}: WheelProps) {
  const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent | null>(null);
  const minDateT = datefns.startOfDay(minDate);
  const maxDateT = datefns.endOfDay(maxDate);
  const minTimestamp = +minDateT;
  const maxTimestamp = +maxDateT;
  const tsRange = maxTimestamp - minTimestamp;
  const { angleOffsetDeg, size, reverse } = styleConfig;

  const angleOffset = (angleOffsetDeg / 360) * Math.PI * 2;

  const dateToAngle = (date: Date) => {
    const p = (+date - minTimestamp) / tsRange;
    return p * Math.PI * 2 * (reverse ? -1 : 1) + angleOffset;
  };

  const eph: WheelRenderEphemeraInternal = {
    minDate: minDateT,
    maxDate: maxDateT,
    dateLocale,
    palette,
    styleConfig,
    dateToAngle,
  };

  const today = new Date();
  const todayIsInRange = today >= minDateT && today <= maxDateT;

  const pastElements =
    styleConfig.pastColor && styleConfig.pastColorOpacity > 0 && todayIsInRange
      ? getPastDaysPieChart(
          eph,
          styleConfig.pastColor,
          styleConfig.pastColorOpacity,
          minDateT,
          today,
        )
      : null;
  const futureElements =
    styleConfig.futureColor &&
    styleConfig.futureColorOpacity > 0 &&
    todayIsInRange
      ? getPeriodDateRing(
          eph,
          styleConfig.futureColor,
          styleConfig.futureColorOpacity,
          today,
          maxDateT,
        )
      : null;
  const transform = [
    `translate(${size / 2},${size / 2})`,
    styleConfig.alignWheelToToday
      ? `rotate(${((+today - minTimestamp) / tsRange) * -360})`
      : "",
  ]
    .filter(Boolean)
    .join(",");
  return (
    <svg viewBox={`0 0 ${size} ${size}`}>
      <g transform={transform}>
        {getSeasonalBackgroundRings(eph)}
        {getMonthRingElements(eph)}
        {pastElements}
        {futureElements}
        {getWeekRingElements(eph)}
        {getDateRingElements(eph)}
        {styleConfig.showTodayIndicator ? getTodayIndicatorElements(eph) : null}
        {getEventsElements(events, categories, eph, setHoveredEvent)}
        {getHoveredEventDisplay(hoveredEvent, categories)}
      </g>
    </svg>
  );
}
