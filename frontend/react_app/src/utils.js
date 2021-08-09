import { getDefaultNormalizer } from "@testing-library/dom"
import { myIdKey, auth_tokenKey } from "./constants"

export function getMyId() {
    return localStorage.getItem(myIdKey)
}

export function getAuthToken() {
    return localStorage.getItem(auth_tokenKey)
}
 
export function mutateAttentively(doMutation, resourceName){
    doMutation().unwrap().catch(err => console.error(`resource ${resourceName} has not been mutated`, err))
}

export function normalizeData(data){
    const normalized = {}
    data.forEach(obj => normalized[obj.id] = obj)
    return normalized
}

export function insertRelated(data, dependentData, attr){
    const normalizedData = normalizeData(data)
    const dependentDataCopy = [...dependentData]
    dependentDataCopy.forEach(obj => obj[attr] = normalizedData[obj[attr]])
    return normalizeData(dependentDataCopy)
}

export function dateToYMD(date) {

    const transformedDate = new Date(date);
    const d = transformedDate.getDate();
    const m = transformedDate.getMonth() + 1;
    const y = transformedDate.getFullYear();
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

export function dateToDMY(date) {

    const transformedDate = new Date(date);
    const d = transformedDate.getDate();
    const m = transformedDate.getMonth() + 1;
    const y = transformedDate.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '-' + (m<=9 ? '0' + m : m) + '-' +  y ;
}