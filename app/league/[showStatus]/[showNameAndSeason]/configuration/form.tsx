"use client";
import { useRouter } from "next/navigation";
import { useRef, useState, MouseEvent } from "react";
import validationPattern from "@/app/dataSources/validationPatterns";
import styles from "./styles.module.scss";
import TextInput from "@/app/components/baseComponents/components/inputs/text/text";
import Select from "@/app/components/baseComponents/components/inputs/select/select";
import Button from "@/app/components/baseComponents/components/button/button";
import { UNAUTHENTICATED_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE, GENERIC_FORM_ERROR_MESSAGE } from "@/app/dataSources/errorMsgs";
import { ILeagueConfigurationData } from "@/app/dataSources/dbFetch";

interface FormError {
    status: number,
}

interface Props {
    initialData: ILeagueConfigurationData;
    leagueConfigurationKey: string;
    showName: string;
    showStatus: string;
    showSeason: string;
}

export default function LeagueConfigurationEditForm(props: Props){
    // This is needed to allow for query selector below
    const formRef = useRef(null as HTMLFormElement | null);
    const [errorMsg, setErrorMsg] = useState("");
    const [formValidation, setFormValidation] = useState(true); // Start as true since we're editing existing data
    const router = useRouter();

    // Convert leagueStatus from "archive" to "archived" for display
    const displayLeagueStatus = props.initialData.leagueStatus === "archive" ? "archived" : props.initialData.leagueStatus;

    const formSubmit = async (e: MouseEvent)=> { 
        e.preventDefault();
        if(formRef.current){
            const formData = new FormData(formRef.current);
            const formObject = Object.fromEntries(formData);

            // Convert "archived" friendly name into valid enum for api
            formObject.leagueStatus = formObject.leagueStatus === "archived" ? "archive" : formObject.leagueStatus;

            const formDataAsJson = JSON.stringify(formObject);

            try{
                const response = await fetch(`/api/league/${props.leagueConfigurationKey}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: formDataAsJson
                });
                if(!response.ok){
                    throw response;
                }
                const result = await response.json();
                if(result.message === "updated" || result.message === "posted"){
                    router.push("/");
                }
            } catch(err: unknown){
                console.log(err);
                setFormValidation(false);
                switch((err as FormError).status){
                case 401:
                    setErrorMsg(UNAUTHENTICATED_ERROR_MESSAGE);
                    break;
                case 403:
                    setErrorMsg(UNAUTHORIZED_ERROR_MESSAGE);
                    break
                default:
                    setErrorMsg(GENERIC_FORM_ERROR_MESSAGE);
                }
            }
        }
    };
    return (
        <>
            {errorMsg && <p className={styles.errorMsg} data-testId={"leagueConfiguration-form-submission-error"}><span className={styles.errorIcon}>!</span>{errorMsg}</p>}
            <form ref={formRef} className={styles.form}>
                <TextInput
                    label="Wikipedia Page URL"
                    placeholder="example: https://en.wikipedia.org/wiki/The_Amazing_Race_37"
                    isRequired={true}
                    validationPattern={validationPattern.wikiPageUrl.string}
                    updateFormValidation={setFormValidation}
                    getFormValidity={()=> formRef.current!.checkValidity()}
                    id="wikiPageUrl"
                    defaultValue={props.initialData.wikiPageUrl}
                />
                <TextInput
                    label="Wiki API URL"
                    placeholder="example: https://en.wikipedia.org/w/api.php?action=parse&format=json&page=The_Amazing_Race_37"
                    isRequired={true}
                    validationPattern={validationPattern.wikiPageUrl.string}
                    updateFormValidation={setFormValidation}
                    getFormValidity={()=> formRef.current!.checkValidity()}
                    id="wikiApiUrl"
                    defaultValue={props.initialData.wikiApiUrl}
                />
                <TextInput
                    label="Google Sheets URL"
                    placeholder="example: https://docs.google.com/spreadsheets/d/testurl"
                    isRequired={true}
                    validationPattern={validationPattern.googleSheetUrl.string}
                    updateFormValidation={setFormValidation}
                    getFormValidity={()=> formRef.current!.checkValidity()}
                    id="googleSheetUrl"
                    defaultValue={props.initialData.googleSheetUrl}
                />
                <TextInput
                    label="Cast Phrase"
                    placeholder="example: Contestants"
                    isRequired={true}
                    validationPattern={validationPattern.contestantType.string}
                    updateFormValidation={setFormValidation}
                    getFormValidity={()=> formRef.current!.checkValidity()}
                    id="castPhrase"
                    defaultValue={props.initialData.castPhrase}
                />
                <TextInput
                    label="Pre Google Sheets Link Text"
                    placeholder="example: This season's contestant data has been sourced from"
                    isRequired={true}
                    validationPattern={validationPattern.contestantType.string}
                    updateFormValidation={setFormValidation}
                    getFormValidity={()=> formRef.current!.checkValidity()}
                    id="preGoogleSheetsLinkText"
                    defaultValue={props.initialData.preGoogleSheetsLinkText}
                />
                <TextInput
                    label="Post Google Sheets Link Text"
                    placeholder="example: which was populated using a google form."
                    isRequired={true}
                    validationPattern={validationPattern.contestantType.string}
                    updateFormValidation={setFormValidation}
                    getFormValidity={()=> formRef.current!.checkValidity()}
                    id="postGoogleSheetsLinkText"
                    defaultValue={props.initialData.postGoogleSheetsLinkText}
                />
                <TextInput
                    label="Competing Entity Name"
                    placeholder="example: team"
                    isRequired={true}
                    validationPattern={validationPattern.contestantType.string}
                    updateFormValidation={setFormValidation}
                    getFormValidity={()=> formRef.current!.checkValidity()}
                    id="competitingEntityName"
                    defaultValue={props.initialData.competitingEntityName}
                />
                <TextInput
                    label="Contestant League Data Key Prefix"
                    placeholder="example: amazing_race:37:*"
                    isRequired={true}
                    validationPattern={validationPattern.contestantType.string}
                    updateFormValidation={setFormValidation}
                    getFormValidity={()=> formRef.current!.checkValidity()}
                    id="contestantLeagueDataKeyPrefix"
                    defaultValue={props.initialData.contestantLeagueDataKeyPrefix}
                />
                <Select 
                    labelText="League Status"
                    selectOptions={
                        [{
                            value: "active",
                            text: "Active"
                        },{
                            value: "archived",
                            text: "Archived"
                        }]
                    }
                    id="leagueStatus"
                    defaultValue={displayLeagueStatus}
                />
                <Button text="Update League"
                    kind="primary"
                    type="submit"
                    id="leagueConfigurationSubmit"
                    clickHandler={formSubmit}
                    disabled={!formValidation}
                />
            </form>
        </>
    );
}
