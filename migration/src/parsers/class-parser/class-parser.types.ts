export type ClassNodeParam = {
  propertyType: string | null;
};

export type ClassNode = {
  returnType: string | null;
  propertyType: string | null;
  params: ClassNodeParam[];
};
