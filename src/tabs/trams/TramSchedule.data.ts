import {TramScheduleData} from "./TramSchedule";

const dayOfWeek = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
export const tramScheduleData: TramScheduleData = {
    departureId: {
        variantId: "20-1",
        stopId: 1399
    },
    timetables: [
        {
            dayName: "Dni powszednie",
            isInEffect: dayOfWeek >= 1 && dayOfWeek <= 5,
            rows: [
                {
                    hour: 4,
                    minutes: [
                        "50"
                    ]
                },
                {
                    hour: 5,
                    minutes: [
                        "10",
                        "29",
                        "43",
                        "57"
                    ]
                },
                {
                    hour: 6,
                    minutes: [
                        "06",
                        "15",
                        "23",
                        "31",
                        "39",
                        "46",
                        "53"
                    ]
                },
                {
                    hour: 7,
                    minutes: [
                        "01",
                        "08",
                        "16",
                        "23",
                        "31",
                        "38",
                        "46",
                        "53"
                    ]
                },
                {
                    hour: 8,
                    minutes: [
                        "01",
                        "08",
                        "16",
                        "23",
                        "31",
                        "38",
                        "46",
                        "53"
                    ]
                },
                {
                    hour: 9,
                    minutes: [
                        "01",
                        "08",
                        "16",
                        "23",
                        "31",
                        "38",
                        "46",
                        "53"
                    ]
                },
                {
                    hour: 10,
                    minutes: [
                        "01",
                        "08",
                        "16",
                        "24",
                        "31",
                        "39",
                        "46",
                        "54"
                    ]
                },
                {
                    hour: 11,
                    minutes: [
                        "01",
                        "09",
                        "16",
                        "24",
                        "31",
                        "39",
                        "46",
                        "54"
                    ]
                },
                {
                    hour: 12,
                    minutes: [
                        "01",
                        "09",
                        "16",
                        "24",
                        "31",
                        "39",
                        "46",
                        "54"
                    ]
                },
                {
                    hour: 13,
                    minutes: [
                        "01",
                        "09",
                        "16",
                        "24",
                        "31",
                        "39",
                        "46",
                        "54"
                    ]
                },
                {
                    hour: 14,
                    minutes: [
                        "01",
                        "09",
                        "16",
                        "23",
                        "31",
                        "38",
                        "46",
                        "53"
                    ]
                },
                {
                    hour: 15,
                    minutes: [
                        "01",
                        "08",
                        "16",
                        "23",
                        "31",
                        "38",
                        "46",
                        "53"
                    ]
                },
                {
                    hour: 16,
                    minutes: [
                        "01",
                        "08",
                        "16",
                        "23",
                        "31",
                        "38",
                        "46",
                        "53"
                    ]
                },
                {
                    hour: 17,
                    minutes: [
                        "01",
                        "08",
                        "16",
                        "23",
                        "31",
                        "38",
                        "46",
                        "53"
                    ]
                },
                {
                    hour: 18,
                    minutes: [
                        "01",
                        "08",
                        "16",
                        "23",
                        "31",
                        "38",
                        "46",
                        "54"
                    ]
                },
                {
                    hour: 19,
                    minutes: [
                        "01",
                        "16",
                        "31",
                        "46"
                    ]
                },
                {
                    hour: 20,
                    minutes: [
                        "01",
                        "16",
                        "31",
                        "47"
                    ]
                },
                {
                    hour: 21,
                    minutes: [
                        "06",
                        "26",
                        "46"
                    ]
                },
                {
                    hour: 22,
                    minutes: [
                        "04",
                        "24",
                        "44"
                    ]
                }
            ],
            legend: []
        },
        {
            dayName: "Soboty",
            isInEffect: dayOfWeek === 6,
            rows: [
                {
                    hour: 4,
                    minutes: [
                        "51"
                    ]
                },
                {
                    hour: 5,
                    minutes: [
                        "11",
                        "31",
                        "51"
                    ]
                },
                {
                    hour: 6,
                    minutes: [
                        "11",
                        "31",
                        "51"
                    ]
                },
                {
                    hour: 7,
                    minutes: [
                        "11",
                        "31",
                        "49"
                    ]
                },
                {
                    hour: 8,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 9,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 10,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 11,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 12,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 13,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 14,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 15,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 16,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 17,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 18,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 19,
                    minutes: [
                        "09",
                        "29",
                        "50"
                    ]
                },
                {
                    hour: 20,
                    minutes: [
                        "10",
                        "30",
                        "51"
                    ]
                },
                {
                    hour: 21,
                    minutes: [
                        "11",
                        "31",
                        "51"
                    ]
                },
                {
                    hour: 22,
                    minutes: [
                        "11",
                        "31",
                        "51"
                    ]
                }
            ],
            legend: []
        },
        {
            dayName: "Święta",
            isInEffect: dayOfWeek === 0,
            rows: [
                {
                    hour: 5,
                    minutes: [
                        "13",
                        "43"
                    ]
                },
                {
                    hour: 6,
                    minutes: [
                        "13",
                        "43"
                    ]
                },
                {
                    hour: 7,
                    minutes: [
                        "13",
                        "43"
                    ]
                },
                {
                    hour: 8,
                    minutes: [
                        "13",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 9,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 10,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 11,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 12,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 13,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 14,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 15,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 16,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 17,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 18,
                    minutes: [
                        "09",
                        "29",
                        "49"
                    ]
                },
                {
                    hour: 19,
                    minutes: [
                        "09",
                        "29",
                        "50"
                    ]
                },
                {
                    hour: 20,
                    minutes: [
                        "10",
                        "30",
                        "51"
                    ]
                },
                {
                    hour: 21,
                    minutes: [
                        "11",
                        "31",
                        "51"
                    ]
                },
                {
                    hour: 22,
                    minutes: [
                        "11",
                        "31",
                        "51"
                    ]
                }
            ],
            legend: []
        }
    ],
    description: "",
    validFrom: "2025-09-27",
    carrierDescription: {
        namePl: "Miejskie Przedsiębiorstwo Komunikacyjne S. A. w Krakowie",
        nameEn: "MPK Kraków",
        descriptionPl: "+48 12-19-150",
        descriptionEn: "+48 12-19-150"
    }
}