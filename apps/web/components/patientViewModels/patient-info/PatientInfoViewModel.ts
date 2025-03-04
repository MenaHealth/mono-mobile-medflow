// components/patientViewModels/patient-dashboard/PatientInfoViewModel.tsx
import { IPatient } from '../../../models/patient';

export class PatientInfoViewModel {
    patient: IPatient | null = null;

    constructor(patientData: IPatient) {
        this.patient = patientData;
    }

    getPrimaryDetails() {
        return {
            patientName: `${this.patient?.firstName} ${this.patient?.lastName}`,
            patientID: this.patient?._id,
        };
    }

    getExpandedDetails() {
        return {
            gender: this.patient?.genderPreference,
            genderPreference: this.patient?.genderPreference,
            firstName: this.patient?.firstName,
            lastName: this.patient?.lastName,
            telegramChatId: this.patient?.telegramChatId || "",
            bmi: this.patient?.bmi,
            pmhx: this.patient?.pmhx,
            pshx: this.patient?.pshx,
            famhx: this.patient?.famhx,
            dob: this.patient?.dob || null,
            patientID: this.patient?._id,
            phone: this.patient?.phone,
            country: this.patient?.country,
            city: this.patient?.city,
            language: this.patient?.language,
            email: this.patient?.email,
            occupation: this.patient?.occupation,
            drinkCount: this.patient?.drinkCount,
            smokeCount: this.patient?.smokeCount,
            otherDrugs: this.patient?.otherDrugs,
            prevMeds: this.patient?.prevMeds,
            currentMeds: this.patient?.currentMeds,
        };
    }
}