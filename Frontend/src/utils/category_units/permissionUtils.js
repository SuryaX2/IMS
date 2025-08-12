export const canEdit = (item, user, isAdmin) => {
    return (
        isAdmin ||
        item.created_by?._id === user?._id ||
        item.created_by === user?._id
    );
};

export const canDelete = (item, user, isAdmin) => {
    return (
        isAdmin ||
        item.created_by?._id === user?._id ||
        item.created_by === user?._id
    );
};

export const getOwnershipTag = (item, user) => {
    const createdById = item.created_by?._id || item.created_by;
    return createdById === user?._id ? "green" : "blue";
};

export const getOwnershipText = (item, user) => {
    const createdById = item.created_by?._id || item.created_by;
    return createdById === user?._id
        ? "You"
        : item.created_by?.username || "Other User";
};
