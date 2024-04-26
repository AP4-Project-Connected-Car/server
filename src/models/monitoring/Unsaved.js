/* -------------------------------------------------------------------------- */
/*                        Unsaved values representation                       */
/* -------------------------------------------------------------------------- */

module.exports = class Unsaved {
    constructor(data) {
        this.data = data;
        if (!this.data.hasOwnProperty('createdAt'))
            this.data.createdAt = new Date();
    }

    save() {
        return this.data;
    }
};