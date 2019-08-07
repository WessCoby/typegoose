import { getModelForClass, mapProp, prop } from '../../src/typegoose';

export class SideNote {
  @prop()
  public content: string;

  @prop()
  public link?: string;
}

enum ProjectValue {
  WORKING = 'working',
  UNDERDEVELOPMENT = 'underdevelopment',
  BROKEN = 'broken'
}

class InternetUser {
  @mapProp({ of: String, mapDefault: {} })
  public socialNetworks?: Map<string, string>;

  @mapProp({ of: SideNote })
  public sideNotes?: Map<string, SideNote>;

  @mapProp({ of: String, enum: ProjectValue })
  public projects: Map<string, ProjectValue>;
}

export const model = getModelForClass(InternetUser);
