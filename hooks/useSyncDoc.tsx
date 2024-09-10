import { useTwilio } from '@/providers/twilio-provider';
import { SyncClient, type SyncDocument } from 'twilio-sync';

export const useSyncDocs = () => {
	const { token } = useTwilio();
	const client = new SyncClient(token);

	// Getting the Sync Document
	const getSyncDoc = async (syncDocName: string): Promise<SyncDocument | undefined> => {
		try {
			const doc = await client.document(syncDocName);
			return doc;
		} catch (error) {
			console.error('Sync Util: getSyncDoc: Error calling this function', error);
		}
	};

	// This is where we update the Sync Document we pass in the syncDocName we are updating
	// We will pass the syncDocName along with the object
	const updateSyncDoc = async (syncDocName: string, object: Array<any>) => {
		try {
			const doc = await client.document(syncDocName);

			if (syncDocName === 'Agent-Assistance') {
				doc.update({
					agentAssistance: object,
				});
			} else {
				doc.update({
					supervisors: object,
				});
			}

			const resolvedDoc = client.document(syncDocName);
			return resolvedDoc;
		} catch (error) {
			console.error('Sync Util: updateSyncDoc: Error calling this function', error);
		}
	};

	// This function takes inputs from other parts of the application to add/remove based on the updateStatus
	// we will adjust the array and eventually pass this into the updateSyncDoc function to update the Sync Doc with the new array
	const initSyncDocAgentAssistance = async (
		agentWorkerSID: string,
		agentFN: string,
		conferenceSID: string,
		selectedTaskSID: string,
		updateStatus: string
	) => {
		const docToUpdate = `Agent-Assistance`;
		let agentAssistanceArray: Array<any> = [];
		const doc = await getSyncDoc(docToUpdate);
		// if (doc?.data?.agentAssistance) {
		// 	agentAssistanceArray = [...doc.data.agentAssistance];
		// }
		if (updateStatus === 'add') {
			agentAssistanceArray.push({
				conference: conferenceSID,
				agentWorkerSID,
				agentFN,
				selectedTaskSID,
				needsAssistance: true,
			});
			// this.updateSyncDoc(docToUpdate, agentAssistanceArray);
		} else if (updateStatus === 'remove') {
			const removeAgentAssistanceIndex = agentAssistanceArray?.findIndex(
				(a: any) => a.agentWorkerSID === agentWorkerSID
			);
			if (removeAgentAssistanceIndex > -1) {
				agentAssistanceArray.splice(removeAgentAssistanceIndex, 1);
			}
			await updateSyncDoc(docToUpdate, agentAssistanceArray);
		}
	};

	// This function takes inputs from other parts of the application to add/remove based on the updateStatus
	// we will adjust the array and eventually pass this into the updateSyncDoc function to update the Sync Doc with the new array
	const initSyncDocSupervisors = async (
		agentWorkerSID: string,
		conferenceSID: string,
		supervisorSID: string,
		supervisorFN: string,
		supervisorStatus: string,
		updateStatus: string
	) => {
		try {
			const docToUpdate = `syncDoc.${agentWorkerSID}`;
			let supervisorsArray: Array<any> = [];
			const doc = await getSyncDoc(docToUpdate);
			// if (doc?.data.supervisors) {
			// 	supervisorsArray = [...doc.data.supervisors];
			// }
			if (updateStatus === 'add') {
				supervisorsArray.push({
					conference: conferenceSID,
					supervisorSID,
					supervisor: supervisorFN,
					status: supervisorStatus,
				});
				await updateSyncDoc(docToUpdate, supervisorsArray);
			} else if (updateStatus === 'update') {
				const updateSupervisorIndex = supervisorsArray.findIndex((s) => s.supervisorSID === supervisorSID);
				if (updateSupervisorIndex > -1) {
					supervisorsArray[updateSupervisorIndex].status = supervisorStatus;
				}
				await updateSyncDoc(docToUpdate, supervisorsArray);
			} else if (updateStatus === 'remove') {
				const removeSupervisorIndex = supervisorsArray.findIndex((s) => s.supervisorSID === supervisorSID);
				if (removeSupervisorIndex > -1) {
					supervisorsArray.splice(removeSupervisorIndex, 1);
				}
				await updateSyncDoc(docToUpdate, supervisorsArray);
			}
		} catch (error) {
			console.error('Sync Util: initSyncDocSupervisors: Error calling this function', error);
		}
	};

	// This will be called when we are tearing down the call to clean up the Sync Doc
	const clearSyncDoc = async (syncDocName: string) => {
		try {
			const doc = await client.document(syncDocName);
			doc.update({
				supervisors: [],
			});
		} catch (error) {
			console.error('Sync Util: clearSyncDoc: Error calling this function', error);
		}
	};

	return {
		getSyncDoc,
		updateSyncDoc,
		initSyncDocAgentAssistance,
		initSyncDocSupervisors,
		clearSyncDoc,
	};
};
