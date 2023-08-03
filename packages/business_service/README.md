# Implementation of business service

The business service will:

-   Store and retrieve the business profile: location, social media links, gallery, etc.
-   Business verification
-   Business settings
-   Business client management: block user, see their interactions, etc.
-   Create business employees
-   Create business service: each service will require: schedule, time, appointment frequency, employees, whether it needs manual confirmation of the appointments, min and max anticipation, among other things.
-   Create business temporary changes of schedule: for employees, service and the business itself. These can be things like business close for the day or enters late, etc.
-   Auto-rearrange appointments algorithm
-   A Metric Service, which will gather information about the business such as, money collected, appointments made, etc.
-   A Feed API, which will offer business search and filtering by category, distance, etc.
-   User and business programmable notifications about the appointments. Users will be notified 24hs and 1 hour before the appointment.

## Client implementation of making an appointment

From the client perspective, the booking will follow this flow:

1. The user will enter the business and "press" make appointment.
2. Chooses the service.
3. Chooses the employee.
4. Chooses the time.
5. Confirms.

## Appointments auto-rearrange algorithm

This algorithm will be fired when a change of schedule is made, for example the business closes and there were appointments for that date, or an appointment gets retarded, or an employee will no be available for a period of time, etc.

So the algorithm will take all the appointments that have to be rearranged, and reserve a new one for the next available free time based on the time of the day of the original one, then the user will have to confirm the appointment.

### An example for further understanding

Say a business works from Mondays to Fridays from 9:00 to 18:00, but the for an urgency one Tuesday the business closes and there 2 appointments for that day, one at 10:00 (morning) and another at 14:00(afternoon). Then the algorithm will take the appointments and will reserve a new one for next available day at the same time of the day. So for first one, it might reserve for the Wednesday at 9:00(morning) in the morning and for the second the same but in the afternoon. Then the user will be notified and he would have to either confirm or get a new one.

The same logic applies for days where the business opens later, etc.

