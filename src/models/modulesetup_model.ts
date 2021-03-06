export class ModuleSetup_Model {
	constructor(
		public MODULE_GUID: string = null,
		public NAME: string = null,
		public DESCRIPTION: string = null,
		public PAGE_GUID: string = null,
		public CREATION_TS: string = null,
		public CREATION_USER_GUID: string = null,
		public UPDATE_TS: string = null,
		public UPDATE_USER_GUID: string = null
	) { }


	static fromJson(json: any) {
		if (!json) return;
		return new ModuleSetup_Model(
			json.MODULE_GUID,
			json.NAME,
			json.DESCRIPTION,
			json.PAGE_GUID,
			json.CREATION_TS,
			json.CREATION_USER_GUID,
			json.UPDATE_TS,
			json.UPDATE_USER_GUID
		);
	}

	toJson(stringify?: boolean): any {
		var doc = {
			MODULE_GUID: this.MODULE_GUID,
			NAME: this.NAME,
			DESCRIPTION: this.DESCRIPTION,
			PAGE_GUID: this.PAGE_GUID,
			CREATION_TS: this.CREATION_TS,
			CREATION_USER_GUID: this.CREATION_USER_GUID,
			UPDATE_TS: this.UPDATE_TS,
			UPDATE_USER_GUID: this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}



