import { IRxOrder } from "@/models/patient";
import { IMedOrder } from "@/models/medOrder";

export const isRxOrder = (item: IRxOrder | IMedOrder): item is IRxOrder => {
    return (item as IRxOrder).prescriptions !== undefined;
};